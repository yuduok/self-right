"use client";
import { useState, useEffect } from 'react';
import KeyGen from "@/component/key/keyGen";
import { message, Alert, Button, Card, Divider, Typography, Row, Col } from 'antd';

const { Title, Paragraph, Text } = Typography;

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
    message.success('HSA DID 已经成功生成并保存');
  };

  return (
    <div className="p-8">
      <Row gutter={32}>
        <Col span={12}>
          <Card>
            <Title level={2} className="text-center">
              HSA 密钥对生成
            </Title>
            <Divider />
            <KeyGen publicKeyName="hsapk" privateKeyName="hsask" />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Title level={2} className="text-center">
              HSA DID 生成
            </Title>
            <Divider />
            <div className="mt-6 flex flex-col items-center space-y-5">
              <Button
                type="primary"
                size="large"
                onClick={generateHSADID}
                disabled={hsaDID !== ''}
              >
                生成 HSA DID
              </Button>

              <div>
                <Paragraph className="font-bold text-lg text-center">
                  当前 HSA DID:
                </Paragraph>
                <Paragraph className="text-gray-700">{hsaDID || 'Not generated'}</Paragraph>
              </div>

              <Alert
                type="info"
                showIcon
                message="注意"
                description={
                  <ul className="list-disc list-inside">
                    <li>请先生成HSA密钥对，再生成HSA DID</li>
                    <li>HSA DID仅需生成一次</li>
                    <li>生成后将自动保存</li>
                  </ul>
                }
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Keys;