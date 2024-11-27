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
        <div className="p-8 space-y-10">
            <div className="text-center">
                <h2 className="text-2xl font-semibold">HSA密钥对生成</h2>
                <KeyGen publicKeyName="hsapk" privateKeyName="hsask" />
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-center">HSA DID生成</h2>
                <div className="mt-6 flex flex-col items-center">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-full transition duration-300"
                        onClick={generateHSADID}
                        disabled={hsaDID !== ''}
                    >
                        生成HSA DID
                    </button>

                    <div className="mt-5">
                        <h3 className="font-bold mb-2 text-lg text-center">当前HSA DID：</h3>
                        <p className="text-gray-700">{hsaDID || '未生成'}</p>
                    </div>

                    <div className="mt-5 text-gray-600">
                        <p className="text-center">注意事项：</p>
                        <ul className="list-disc list-inside text-left">
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