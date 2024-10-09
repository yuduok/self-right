"use client"
import generateKeyPair from "@/utils/keygenerate"
import { useState } from "react"
import { message } from "antd"

export default function KeyGen() {
  const [sk, setSk] = useState(null)
  const [pk, setPk] = useState(null)
  
  const showCopiedMessage = (text) => {
    message.success(`${text}复制成功`)
    setTimeout(() => {
      message.destroy()
    }, 2000)
  }

  const handleGenerateKeys = () => {
    const {privateKey, publicKey} = generateKeyPair()
    setSk(privateKey)
    setPk(publicKey)
    // trans backend ...
  }

  return (
    <div className="p-4 flex flex-col items-center mt-16">
      <button 
        onClick={handleGenerateKeys}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        生成密钥
      </button>
      {(sk || pk) && (
        <div className="mt-4">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr>
                {sk && <th className="border p-2 bg-gray-100 font-bold text-gray-700">私钥</th>}
                {pk && <th className="border p-2 bg-gray-100 font-bold text-gray-700">公钥</th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                {sk && (
                  <td 
                    className="border p-2 font-mono text-gray-700 cursor-pointer" 
                    onClick={() => { navigator.clipboard.writeText(sk.toString()); 
                      showCopiedMessage("私钥")
                    }}
                  >
                    ...
                  </td>
                )}
                {pk && (
                  <td 
                    className="border p-2 font-mono text-gray-700 cursor-pointer"
                    onClick={() => { navigator.clipboard.writeText(`(${pk.x},${pk.y})`); 
                      showCopiedMessage("公钥")
                    }}
                  >
                    ...
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}