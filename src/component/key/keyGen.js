"use client"
import generateKeyPair from "@/utils/keygenerate"
import { useState } from "react"

export default function KeyGen() {
  const [sk, setSk] = useState(null)
  const [pk, setPk] = useState(null)

  const handleGenerateKeys = () => {
    const {privateKey, publicKey} = generateKeyPair()
    setSk(privateKey)
    setPk(publicKey)
    // trans backend ...
  }

  return (
    <div className="p-4">
      <button 
        onClick={handleGenerateKeys}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        生成密钥
      </button>
      {sk && <div className="mt-4 text-gray-700">私钥: <span className="font-mono">{sk.toString()}</span></div>}
      {pk && <div className="mt-2 text-gray-700">公钥: <span className="font-mono">{JSON.stringify(pk)}</span></div>}
    </div>
  )
}