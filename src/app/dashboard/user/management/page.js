"use client"
import Camera from "@/component/camera/Camera";

const Management = ()=>{
  
  const handleDownload = ()=>{
    const a = document.createElement("a");
    a.href = "http://47.98.178.174:8080/load";
    a.download = "your_avatar.exe";
    a.click();
    a.remove();
    
  }
    return(
        <div className="mt-16">
            <h1 className="text-center text-black">申请智能化身</h1>
            <div className="mt-5">
                <Camera/>
            </div>
            <button onClick={handleDownload} className="block mx-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
              下载智能化身
            </button>
        </div>
    )
}

export default Management;