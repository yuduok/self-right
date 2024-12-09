"use client"
import useAuthStore from "@/store/authStore"
import { useState, useEffect } from "react";
import { Button, Card, Typography,message } from 'antd';

const { Title, Paragraph } = Typography;

const Management = () => {
  const { token } = useAuthStore.getState()
  const [canApply, setCanApply] = useState(false)
  const [accountDetails, setAccountDetails] = useState([])

  const handleApply = async () => {
    const response = await fetch("/api/avatar/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token
      })
    })
    const data = await response.json()

    if (data.code === "1") {
      setAccountDetails(data.data)
    }
    console.log(data)
  }

  const handleQuery = async () => {
    const response = await fetch("/api/avatar/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token
      })
    })
    const data = await response.json()

    if (data.code === "1") {
      setAccountDetails(data.data)
      setCanApply(false)
    }
    else {
      setCanApply(true)
    }
    console.log(data)

  }

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/avatar/download", {
        method: "POST"
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'avatar.exe';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      message.success("下载成功");
    } catch (error) {
      console.error('下载失败:', error);
      message.error('下载失败');
    }
  }

  useEffect(() => {
    handleQuery()
  }, [])

  return (
    <div className="mt-16">
      {canApply && (
        <Button onClick={handleApply} type="primary" className="block mx-auto mt-4">申请智能化身</Button>
      )}
      <Button onClick={handleQuery} type="primary" className="block mx-auto mt-4">查询智能化身账号</Button>
      <div className="p-4">
        {accountDetails && (
          <Card className="mt-4">
            <Title level={4}>账号信息：</Title>
            <Paragraph>账号：<strong>{accountDetails.username}</strong></Paragraph>
            <Paragraph>密码：<strong>{accountDetails.password}</strong></Paragraph>
          </Card>
        )}
      </div>
      <Button onClick={handleDownload} type="primary" className="block mx-auto mt-4">下载智能化身程序</Button>
    </div>
  )
}

export default Management;