"use client";
import { useState, useEffect } from 'react';
import { message,Input } from 'antd';
import { ec as EC } from 'elliptic';
import crypto from 'crypto';
import useAuthStore from '@/store/authStore';

const Hierarchical = () => {
    const {token} = useAuthStore.getState();

    const [didInfo, setDidInfo] = useState({
        DIDi: '', // 新生儿的DID
        DIDHSAi: '', // 层级担保人的DID
        biometricWeak: 'weakparent', // 示例生物特征数据
        UOIBFDi: 'hospital' // 示例办公室标识符
    });

    const [req2Data, setReq2Data] = useState({
        // TIDb: 'tid:从后端获取',
        // TIDmHSAi: 'tid:从后端获取',
        UOIMVi: 'government',
        PIIHSAi: 'HSA_Personal_Info',
        PIIi: 'Child_Personal_Info'
    });

    const [parentInfo, setParentInfo] = useState({
        name: '',
        phone: '',
        address: ''
    });

    const [childInfo, setChildInfo] = useState({
        name: ''
    });

    const handleParentInfoChange = (e) => {
        const { name, value } = e.target;
        setParentInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleChildInfoChange = (e) => {
        const { name, value } = e.target;
        setChildInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        // Update req2Data with form inputs
        setReq2Data(prev => ({
            ...prev, 
            PIIHSAi: JSON.stringify(parentInfo),
            PIIi: JSON.stringify(childInfo)
        }));
        message.success('信息已更新');
    };

    useEffect(() => {
        // 只获取已存在的HSA DID
        const hsaDID = localStorage.getItem('HSA_DID');
        const childDID = localStorage.getItem('CHILD_DID');

        if (hsaDID) {
            setDidInfo(prev => ({...prev, DIDHSAi: hsaDID}));
        }
        if (childDID) {
            setDidInfo(prev => ({...prev, DIDi: childDID}));
        }
    }, []);

    // 生成新生儿did
    const generateChildDID = () => {
        const newChildDID = `did:child:${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('CHILD_DID', newChildDID);

        setDidInfo(prev => ({
            ...prev, 
            DIDi: newChildDID
        }));

        message.success('新生儿DID已生成并保存');
    };

    // 椭圆曲线加密数据
    const encryptData = (data, publicKey) => {
        try {
            const ec = new EC('secp256k1');

            const publicKeyPoint = ec.keyFromPublic({
                x: publicKey.x,
                y: publicKey.y
            }, 'hex').getPublic();

            const messageBuffer = Buffer.from(JSON.stringify(data));

            const encrypted = Buffer.alloc(messageBuffer.length);
            for (let i = 0; i < messageBuffer.length; i++) {
                encrypted[i] = messageBuffer[i] ^ parseInt(publicKeyPoint.getX().toString('hex').slice(i % 64, i % 64 + 2), 16);
            }

            return {
                ciphertext: encrypted.toString('hex')
            };
        } catch (error) {
            console.error('Encryption error:', error);
            throw error;
        }
    };

    // 与api对接获取pk
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

    const sendREQ1 = async () => {
        try {
            // 检查HSA DID是否存在
            if (!didInfo.DIDHSAi) {
                message.error('请先生成HSA DID');
                return;
            }
            const hpdata = await getPk(3)
            const hppkStr = hpdata.data.pk;
            // console.log('hppkStr',hppkStr);
            if (!hppkStr) {
                message.error('未找到医院公钥');
                return;
            }

            const [x, y] = hppkStr.slice(1, -1).split(',');
            const hppk = { x, y };
            // console.log(hppk);

            if (!hppk.x || !hppk.y) {
                message.error('医院公钥格式不正确');
                return;
            }

            const req1Data = {
                DIDi: didInfo.DIDi,
                DIDHSAi: didInfo.DIDHSAi,
                biometricWeak: didInfo.biometricWeak,
                UOIBFDi: didInfo.UOIBFDi
            };

            const encryptedREQ1 = encryptData(req1Data, hppk);

            // console.log('Encrypted REQ1:', encryptedREQ1);
            message.success('REQ1请求已加密');


            const res = await fetch('/api/req/req1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ciphertext: encryptedREQ1.ciphertext,
                    token
                })
            });

            const data = await res.json()
            if(data.code === '0'){
                message.warning('已发送过请求')
            }
            else if(data.code === '1'){
                message.success('已成功发送请求')
            }
            // console.log('req1', res);

        } catch (error) {
            console.error('Error sending REQ1:', error);
            message.error('发送REQ1失败');
        }
    };

    const sendREQ2 = async () => {
        try {
            const mvdata = await getPk(4); // 后端返回数据，包含公钥
            const mvpkStr = mvdata.data.pk 
            if (!mvpkStr) {
                message.error('未找到政府公钥');
                return;
            }

            const [x, y] = mvpkStr.slice(1,-1).split(',');
            const mvpk = {x,y}

            if (!mvpk.x || !mvpk.y) {
                message.error('政府公钥格式不正确');
                return;
            }

            const req2DataToEncrypt = {
                ...req2Data,
                DIDi: didInfo.DIDi,
                DIDHSAi: didInfo.DIDHSAi,
                hash: crypto.createHash('sha256').update(`${req2Data.TIDb}${req2Data.TIDmHSAi}${didInfo.DIDi}${didInfo.DIDHSAi}`).digest('hex')
            };

            const encryptedREQ2 = encryptData(req2DataToEncrypt, mvpk);
            // console.log('Encrypted REQ2:', encryptedREQ2);
            message.success('REQ2请求已加密并发送');

            const res = await fetch('/api/req/req2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ciphertext: encryptedREQ2.ciphertext,
                    token
                })
            });
            const data = await res.json()
            if(data.code === '0'){
                message.warning('已发送过请求')
            }
            else if(data.code === '1'){
                message.success('已成功发送请求')
            }
            // console.log('req2', res);

        } catch (error) {
            console.error('Error sending REQ2:', error);
            message.error('发送REQ2失败');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-center text-black text-2xl font-bold mb-6">
                层级化身生成系统
            </h1>

            <div className="space-y-4">

            <div>
                    <h2 className="font-bold mb-2">输入信息</h2>
                    <div className="mb-2">
                        <h3 className="font-bold">父母信息</h3>
                        <Input 
                            placeholder="姓名" 
                            name="name" 
                            value={parentInfo.name} 
                            onChange={handleParentInfoChange} 
                        />
                        <Input 
                            placeholder="电话号码" 
                            name="phone" 
                            value={parentInfo.phone} 
                            onChange={handleParentInfoChange} 
                        />
                        <Input 
                            placeholder="住址" 
                            name="address" 
                            value={parentInfo.address} 
                            onChange={handleParentInfoChange} 
                        />
                    </div>
                    <div className="mb-2">
                        <h3 className="font-bold">新生儿信息</h3>
                        <Input 
                            placeholder="姓名" 
                            name="name" 
                            value={childInfo.name} 
                            onChange={handleChildInfoChange} 
                        />
                    </div>
                    <button 
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleSubmit}
                    >
                        保存信息
                    </button>
                </div>

                <div>
                    <button 
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
                        onClick={generateChildDID}
                        disabled={didInfo.DIDi}
                    >
                        生成新生儿DID
                    </button>

                    <button 
                        className="bg-green-500 text-white px-4 py-2 rounded mr-4"
                        onClick={sendREQ1}
                        disabled={!didInfo.DIDi || !didInfo.DIDHSAi}
                    >
                        发送REQ1请求
                    </button>

                    <button 
                        className="bg-purple-500 text-white px-4 py-2 rounded"
                        onClick={sendREQ2}
                        // disabled={!req2Data.TIDb}
                    >
                        发送REQ2请求
                    </button>
                </div>

                <div className="mt-4">
                    <h2 className="font-bold mb-2">当前信息：</h2>
                    <p>新生儿DID: {didInfo.DIDi || '未生成'}</p>
                    <p>层级担保人DID: {didInfo.DIDHSAi || '未生成'}</p>
                    {/* <p>TIDb: {req2Data.TIDb || '未获取'}</p>
                    <p>TIDmHSAi: {req2Data.TIDmHSAi || '未生成'}</p> */}
                </div>
            </div>
        </div>
    );
};

export default Hierarchical;