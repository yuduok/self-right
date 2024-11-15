"use client";
import { useState, useEffect } from 'react';
import KeyGen from "@/component/key/keyGen";
import { message } from 'antd';

const Keys = () => {
    const [hsaDID, setHsaDID] = useState('');

    useEffect(() => {
        const storedHSADID = localStorage.getItem('HSA_DID');
        if (storedHSADID) {
            setHsaDID(storedHSADID);
        }
    }, []);

    const generateHSADID = () => {
        const hsapk = localStorage.getItem('hsapk');
        const hsask = localStorage.getItem('hsask');

        if (!hsapk || !hsask) {
            message.error('请先生成HSA密钥对');
            return;
        }

        const newHSADID = `did:hsa:${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        localStorage.setItem('HSA_DID', newHSADID);
        setHsaDID(newHSADID);
        message.success('HSA DID已生成并保存');
    };

    return (
        <div className="space-y-8 p-4">
            <div>
                <h2 className="text-xl font-bold mb-4 text-center">HSA密钥对生成</h2>
                <KeyGen publicKeyName="hsapk" privateKeyName="hsask"/>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">HSA DID生成</h2>
                <div className="space-y-4">
                    <button 
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={generateHSADID}
                        disabled={hsaDID !== ''}
                    >
                        生成HSA DID
                    </button>

                    <div className="mt-4">
                        <h3 className="font-bold mb-2">当前HSA DID：</h3>
                        <p>{hsaDID || '未生成'}</p>
                    </div>

                    <div className="mt-4 text-gray-600">
                        <p>注意事项：</p>
                        <ul className="list-disc list-inside">
                            <li>请先生成HSA密钥对，再生成HSA DID</li>
                            <li>HSA DID仅需生成一次</li>
                            <li>生成后将自动保存</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Keys;