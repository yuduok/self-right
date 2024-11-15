"use client";
import { useState, useEffect } from 'react';
import { message } from 'antd';
import { ec as EC } from 'elliptic';
import crypto from 'crypto';

const Digitalization = () => {
    const [verificationData, setVerificationData] = useState({
        TIDb: '', 
        biometricWeak: '',
        biometricStrong: '',
        kappa: '',
        hash: ''
    });

    const [encryptedREP1, setEncryptedREP1] = useState('');

    const generateVerificationData = () => {
        const TIDb = `tid:后端获取`;
        const biometricStrong = 'childstrong';
        const kappa = 'child_k_secret_hosiptal';

        setVerificationData({
            TIDb,
            biometricWeak: 'child_weak',
            biometricStrong,
            kappa,
            hash: crypto.createHash('sha256')
                .update(`${TIDb}${biometricStrong}${kappa}`)
                .digest('hex')
        });
    };

    const encryptREP1 = () => {
        try {
            const hsapkStr = localStorage.getItem('hsapk');
            if (!hsapkStr) {
                message.error('未找到HSA公钥');
                return;
            }

            const hsapk = JSON.parse(hsapkStr);
            const ec = new EC('secp256k1');

            const dataToEncrypt = {
                TIDb: verificationData.TIDb,
                biometricWeak: verificationData.biometricWeak,
                biometricStrong: verificationData.biometricStrong,
                kappa: verificationData.kappa,
                hash: verificationData.hash
            };

            const messageBuffer = Buffer.from(JSON.stringify(dataToEncrypt));

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

            setEncryptedREP1(JSON.stringify(encryptedData));
            message.success('REP1加密成功');
            console.log(encryptedData)

        } catch (error) {
            console.error('Encryption error:', error);
            message.error('REP1加密失败');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">生物特征数字化审核</h1>

            <div className="space-y-4">
                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
                    onClick={generateVerificationData}
                >
                    生成审核数据
                </button>

                <button 
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={encryptREP1}
                    disabled={!verificationData.TIDb}
                >
                    加密并生成REP1
                </button>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">审核数据：</h2>
                    <div className="space-y-2">
                        <p>临时ID (TIDb): {verificationData.TIDb || '未生成'}</p>
                        <p>弱生物特征: {verificationData.biometricWeak || '未生成'}</p>
                        <p>强生物特征: {verificationData.biometricStrong || '未生成'}</p>
                        <p>κ值: {verificationData.kappa || '未生成'}</p>
                        <p>哈希值: {verificationData.hash || '未生成'}</p>
                    </div>
                </div>

                {encryptedREP1 && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-3">加密后的REP1：</h2>
                        <div className="bg-gray-100 p-4 rounded overflow-auto">
                            <pre className="text-sm">{encryptedREP1}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Digitalization;