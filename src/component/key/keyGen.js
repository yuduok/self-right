"use client"
import { useState, useEffect } from "react"
import { message, Spin, Table } from "antd"
import { ec as EC } from 'elliptic';

export default function KeyGen({ privateKeyName = 'privateKey', publicKeyName = 'publicKey' }) {
  const [sk, setSk] = useState(null)
  const [pk, setPk] = useState(null)
  const [loading, setLoading] = useState(false)

  // Initialize elliptic curve
  const ec = new EC('secp256k1');

  useEffect(() => {
    const storedSk = localStorage.getItem(privateKeyName)
    const storedPk = localStorage.getItem(publicKeyName)
    if (storedSk && storedPk) {
      setSk(storedSk)
      setPk(JSON.parse(storedPk))
    }
  }, [privateKeyName, publicKeyName])

  const showCopiedMessage = (text) => {
    message.success(`${text}复制成功`)
    setTimeout(() => {
      message.destroy()
    }, 2000)
  }

  const handleGenerateKeys = async () => {
    setLoading(true)
    try {
      // Generate key pair using elliptic
      const keyPair = ec.genKeyPair();

      // Get private key as hex string
      const privateKey = keyPair.getPrivate('hex');

      // Get public key coordinates
      const publicKey = keyPair.getPublic();
      const publicKeyObj = {
        x: publicKey.getX().toString('hex'),
        y: publicKey.getY().toString('hex')
      };

      // Update state
      setSk(privateKey)
      setPk(publicKeyObj)

      // Store in localStorage
      localStorage.setItem(privateKeyName, privateKey)
      localStorage.setItem(publicKeyName, JSON.stringify(publicKeyObj))

      message.success('密钥对生成成功')
    } catch (error) {
      message.error('生成密钥失败，请重试')
      console.error('Key generation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatKey = (key) => {
    if (!key) return '';
    if (typeof key === 'string') return key;
    if (typeof key === 'object' && key.x && key.y) {
      return `(${key.x},${key.y})`;
    }
    return String(key);
  }

  const truncateKey = (key, maxLength = 20) => {
    const formattedKey = formatKey(key)
    return formattedKey.length > maxLength
      ? `${formattedKey.slice(0, maxLength)}...`
      : formattedKey
  }

  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      render: (_, record) => (
        <span
          className="cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(formatKey(record.fullValue))
            showCopiedMessage(record.type)
          }}
        >
          {truncateKey(record.fullValue)}
        </span>
      ),
    },
  ]

  const data = [
    { key: 1, type: '私钥', value: sk ? truncateKey(sk) : '', fullValue: sk },
    { key: 2, type: '公钥', value: pk ? truncateKey(pk) : '', fullValue: pk },
  ]

  return (
    <div className="p-4 flex flex-col items-center mt-16">
      <Spin spinning={loading}>
        <div className="flex flex-col items-center w-full">
          <button 
            onClick={handleGenerateKeys}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
            disabled={loading || (sk && pk)}
          >
            {sk && pk ? "密钥已存在" : "生成密钥"}
          </button>
          {(sk || pk) && (
            <div className="w-full max-w-2xl">
              <Table 
                columns={columns} 
                dataSource={data} 
                pagination={false}
                className="w-full"
              />
            </div>
          )}
        </div>
      </Spin>
    </div>
  )
}