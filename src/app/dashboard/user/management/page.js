"use client"
import useAuthStore from "@/store/authStore"
import { useState,useEffect } from "react";

const Management = ()=>{
  const {token} = useAuthStore.getState()
  const [canApply, setCanApply] = useState(false)
  const [accountDetails, setAccountDetails] = useState([])
  
  const handleApply = async ()=>{
    const response = await fetch("/api/avatar/apply",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token
      })
    })
    const data = await response.json()

    if(data.code === "1"){
      setAccountDetails(data.data)
    }
    console.log(data)
  }

  const handleQuery = async ()=>{
    const response = await fetch("/api/avatar/query",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token
      })
    })
    const data = await response.json()

    if(data.code === "1"){
      setAccountDetails(data.data)
      setCanApply(false)
    }
    else{
      setCanApply(true)
    }
    console.log(data)

  }

  useEffect(()=>{
    handleQuery()
  },[])
  
    return(
      <div className="mt-16">
      {canApply && (
        <button onClick={handleApply} className="block mx-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          申请智能化身
        </button>
      )}
      <button onClick={handleQuery} className="block mx-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
        查询智能化身账号
      </button>
      {accountDetails && (
        <div className="mt-4">
          <h2>账号信息：<br/></h2>
          <p>账号：{accountDetails.username}<br/>密码：{accountDetails.password}</p>
        </div>
      )}
    </div>
    )
}

export default Management;