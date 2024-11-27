"use client";
import { useState, useEffect } from 'react';
import { message, Table } from 'antd';
import { ec as EC } from 'elliptic';

const Digitalization = () => {
    const [rep2DataList, setRep2DataList] = useState([]);
    const [encryptedREP2, setEncryptedREP2] = useState('');

    const fetchData = async () => {
        try {
            const response = await fetch('/api/list');
            const result = await response.json();

            if (result.code !== "1") {
                message.error(`获取审核列表失败：${result.message}`);
                return;
            }

            const filterList = result.data.filter((item)=>{
                return item.hspstate === 2
            })

            setRep2DataList(filterList);
        } catch (error) {
            message.error('获取审核列表失败');
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 拿用户公钥
    const getPk = async (id) => {
        try {
            console.log('开始获取公钥');
            const response = await fetch('/api/key', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id })
            });
            const data = await response.json();
            console.log('获取公钥成功', data);
            return data;
        } catch (error) {
            console.error('获取公钥失败', error);
            throw error;
        }
    }

    const encryptandSendREP2 = async (record) => {
        try {
            // hsa pk
            const hsadata = await getPk(1)
            const hsapkStr = hsadata.data.pk;
            if (!hsapkStr) {
                message.error('未找到HSA公钥');
                return;
            }

            const [x, y] = hsapkStr.slice(1, -1).split(',');
            const hsapk = { x, y };

            const ec = new EC('secp256k1');

            // const mvsk = localStorage.getItem('mvsk');
            // if (!mvsk) {
            //     message.error('未找到政府密钥');
            //     return;
            // }

            // 解密ciphertext2
            // const ciphertext2 = record.ciphertext2;
            // const ciphertext2Buffer = Buffer.from(ciphertext2, 'hex');
            // const decrypted2 = ec.keyFromPrivate(mvsk).decrypt(ciphertext2Buffer);
            // const decrypted2Str = decrypted2.toString('utf8');
            // const { didi,didh,hash } = JSON.parse(decrypted2Str);

            const messageBuffer = Buffer.from(JSON.stringify(record));

            const publicKey = ec.keyFromPublic({
                x: hsapk.x,
                y: hsapk.y
            }, 'hex');

            const encrypted = Buffer.alloc(messageBuffer.length);
            for (let i = 0; i < messageBuffer.length; i++) {
                encrypted[i] = messageBuffer[i] ^ parseInt(publicKey.getPublic().getX().toString('hex').slice(i % 64, i % 64 + 2), 16);
            }

            const encryptedData = {
                ciphertext: encrypted.toString('hex')
            };

            setEncryptedREP2(JSON.stringify(encryptedData));
            message.success('REP2加密成功');
            // console.log(encryptedData);

            const res = await fetch('/api/rep/rep2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Cache-Control": "no-cache"
                },
                body: JSON.stringify({
                    id:record.id
                })
            });

            const data = await res.json()
            if(data.code === '1'){
                message.success('已成功审核')
                await fetchData().then(()=>{
                    record.govstate = 2
                });
            }

        } catch (error) {
            console.error('Encryption error:', error);
            message.error('REP2加密失败');
        }
    };

    const columns = [
        {
            title: '用户id',
            dataIndex: 'uid',
            key: 'uid',
        },
        // {
        //     title: 'id',
        //     dataIndex: 'id',
        //     key: 'id',
        // },
        // {
        //     title: '医院状态',
        //     dataIndex: 'hspstate',
        //     key: 'hspstate',
        // },
        {
            title: '政府状态',
            dataIndex: 'govstate',
            key: 'govstate',
            render: (govstate) => {
                switch (govstate) {
                    case 2:
                        return '审核通过';
                    case 1:
                        return '待审核';
                    case 0:
                        return '未申请';
                    default:
                        return '未知状态';
                }
            }
        },
        // {
        //     title: '密文1',
        //     dataIndex: 'ciphertext1',
        //     key: 'ciphertext1',
        // },
        // {
        //     title: '密文2',
        //     dataIndex: 'ciphertext2',
        //     key: 'ciphertext2',
        // },
        {
            title: 'K值',
            dataIndex: 'k',
            key: 'k',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <button 
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => record.govstate !== 2 && encryptandSendREP2(record)}
                    disabled={record.govstate === 2}
                >
                    加密并生成REP2
                </button>
            ),
        }
    ];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">政府数字化审核</h1>
            <Table dataSource={rep2DataList} columns={columns} rowKey="TIDm" />

            {/* {encryptedREP2 && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">加密后的REP2：</h2>
                    <div className="bg-gray-100 p-4 rounded overflow-auto">
                        <pre className="text-sm">{encryptedREP2}</pre>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default Digitalization;