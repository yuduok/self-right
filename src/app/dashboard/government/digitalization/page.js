"use client";
import { useState } from 'react';
import { message } from 'antd';
import { ec as EC } from 'elliptic';
import crypto from 'crypto';

const Digitalization = () => {
    const [verificationData, setVerificationData] = useState({
        TIDb: '',
        DIDi: '',
        DIDHSAi: '',
        UOIMVi: '',
        TIDmHSAi: '',
        PIIHSAi: '',
        PIIi: '',
        hash: ''
    });

    const [rep2Data, setRep2Data] = useState({
        TIDm: '',
        kappa: '',
        hash: ''
    });

    const [encryptedREP2, setEncryptedREP2] = useState('');

    const generateVerificationData = () => {
        const TIDm = `tidm:从后端获取`;
        const kappa = 'child_k_secret_government';

        setVerificationData({
            TIDb: `tidb:从后端获取`,
            DIDi: `did:从后端获取`,
            DIDHSAi: `did:hsa:从后端获取`,
            UOIMVi: 'government',
            TIDmHSAi: `tidhsa:从后端获取`,
            PIIHSAi: 'HSA_Personal_Info',
            PIIi: 'Child_Personal_Info',
            hash: crypto.createHash('sha256').update(`${TIDm}${kappa}`).digest('hex')
        });

        setRep2Data({
            TIDm,
            kappa,
            hash: crypto.createHash('sha256').update(`${TIDm}${kappa}Child Personal Info`).digest('hex')
        });
    };

    const encryptREP2 = () => {
        try {
            const hsapkStr = localStorage.getItem('hsapk');
            if (!hsapkStr) {
                message.error('未找到HSA公钥');
                return;
            }

            const hsapk = JSON.parse(hsapkStr);
            const ec = new EC('secp256k1');

            const dataToEncrypt = rep2Data;

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

            setEncryptedREP2(JSON.stringify(encryptedData));
            message.success('REP2加密成功');
            console.log(encryptedData);

        } catch (error) {
            console.error('Encryption error:', error);
            message.error('REP2加密失败');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">政府数字化审核</h1>

            <div className="space-y-4">
                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
                    onClick={generateVerificationData}
                >
                    生成审核数据
                </button>

                <button 
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={encryptREP2}
                    disabled={!verificationData.TIDb}
                >
                    加密并生成REP2
                </button>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">审核数据：</h2>
                    <div className="space-y-2">
                        <p>TIDb: {verificationData.TIDb || '未生成'}</p>
                        <p>DIDi: {verificationData.DIDi || '未生成'}</p>
                        <p>DIDHSAi: {verificationData.DIDHSAi || '未生成'}</p>
                        <p>UOIMVi: {verificationData.UOIMVi || '未生成'}</p>
                        <p>TIDmHSAi: {verificationData.TIDmHSAi || '未生成'}</p>
                        <p>PIIHSAi: {verificationData.PIIHSAi || '未生成'}</p>
                        <p>PIIi: {verificationData.PIIi || '未生成'}</p>
                        <p>Hash: {verificationData.hash || '未生成'}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">REP2数据：</h2>
                    <div className="space-y-2">
                        <p>TIDm: {rep2Data.TIDm || '未生成'}</p>
                        <p>Kappa: {rep2Data.kappa || '未生成'}</p>
                        <p>Hash: {rep2Data.hash || '未生成'}</p>
                    </div>
                </div>

                {encryptedREP2 && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-3">加密后的REP2：</h2>
                        <div className="bg-gray-100 p-4 rounded overflow-auto">
                            <pre className="text-sm">{encryptedREP2}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Digitalization;