"use client"
import { useState, useEffect } from 'react';
import { Button } from 'antd';
import * as shamirSecret from 'shamirs-secret-sharing';

const paillier = require('paillier-js');

export default function PaillierKey() {
    const [keys, setKeys] = useState(null);
    const [shares, setShares] = useState(null);

    // 初始化或获取密钥对
    useEffect( () => {
        async function initializeKeys() {
            const storedPublicKey = localStorage.getItem('paillierPublicKey');
            const storedPrivateKey = localStorage.getItem('paillierPrivateKey');

            if (storedPublicKey && storedPrivateKey) {
                setKeys({
                    publicKey: JSON.parse(storedPublicKey),
                    privateKey: JSON.parse(storedPrivateKey)
                });

                console.log('已加载密钥');
                // 从API获取shares
                await getSharesFromAPI();
            } else {
                const { publicKey, privateKey } = await paillier.generateRandomKeys(1024);
                localStorage.setItem('paillierPublicKey', JSON.stringify({
                    n: publicKey.n.toString(),
                    g: publicKey.g.toString()
                }));
                localStorage.setItem('paillierPrivateKey', JSON.stringify(privateKey.toString()));
                setKeys({ publicKey, privateKey });
            }
        }

        initializeKeys();
    }, []);

    const getSharesFromAPI = async () => {
        try {
          console.log('开始获取分享');
            const response = await fetch('/api/shareKey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: 1 })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('获取分享成功', data);
                setShares(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch shares:', error);
        }
    };

    // 生成密钥分享
    const generateShares = () => {
        if (!keys?.privateKey) return;

        // 将私钥转换为Buffer
        const privateKeyBuffer = Buffer.from(keys.privateKey.toString());

        // 生成3份密钥分享，需要2份才能重建
        const shares = shamirSecret.split(privateKeyBuffer, {
            shares: 3,
            threshold: 2
        });

        // 将shares转换为hex字符串存储
        const sharesHex = shares.map(share => share.toString('hex'));
        setShares(sharesHex);
    };

    // 重新生成新的密钥对
    const regenerateKeys = async () => {
        const { publicKey, privateKey } = await paillier.generateRandomKeys(1024);
        localStorage.setItem('paillierPublicKey', JSON.stringify({
            n: publicKey.n.toString(),
            g: publicKey.g.toString()
        }));
        localStorage.setItem('paillierPrivateKey', JSON.stringify(privateKey.toString()));
        setKeys({ publicKey, privateKey });
        setShares(null);
    };

    return (
        <div className="p-4">
            <div className="text-lg mb-4">Paillier密钥管理</div>

            <div className="mb-4">
                <Button 
                    type="primary" 
                    onClick={regenerateKeys}
                    className="mr-2"
                >
                    重新生成密钥对
                </Button>
                <Button 
                    onClick={generateShares}
                    disabled={!keys}
                >
                    生成密钥分享
                </Button>
            </div>

            {keys && keys.publicKey && (
                <div className="mb-4">
                    <div className="font-bold">公钥坐标:</div>
                    <div className="break-all bg-gray-100 p-2 rounded">
                        <div>n = {keys.publicKey.n?.toString()}</div>
                        <div>g = {keys.publicKey.g?.toString()}</div>
                    </div>
                </div>
            )}

            {/* {shares && (
                <div>
                    <div className="font-bold mb-2">密钥分享 (需要其中任意2份才能重建私钥):</div>
                    {shares.map((share, index) => (
                        <div key={index} className="mb-2">
                            <div>分享 {index + 1}:</div>
                            <div className="break-all bg-gray-100 p-2 rounded">
                                {share}
                            </div>
                        </div>
                    ))}
                </div>
            )} */}

            {shares && (
                <div>
                    <div className="font-bold mb-2">密钥分享 (需要其中任意2份才能重建私钥):</div>
                    {
                            <div className="mb-2">
                                <div>您的分享 :</div>
                                <div className="break-all bg-gray-100 p-2 rounded">
                                    {shares}
                                </div>
                            </div>
                    }
                </div>
            )}
        </div>
    );
}