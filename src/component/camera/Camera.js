"use client";
import { useState, useEffect, useRef } from "react";

const Camera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (isCapturing) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setStream(stream);
        } catch (err) {
          console.error("Error accessing the camera:", err);
        }
      };

      startCamera();
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCapturing]);

  const captureImage = async() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, 640, 480);
      const imageData = canvasRef.current.toDataURL('image/jpeg');
      await faceRecognition(imageData);
    }
  };

  const faceRecognition = async(imageData) => {
    try {
      console.log("Sending request to /api/face");
      console.log("Image data:", imageData);
      const response = await fetch('/api/face', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
        }),
      });
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
      return data;
    } catch (error) {
      console.error("Error in faceRecognition:", error);
      return error;
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => setIsCapturing(!isCapturing)}
      >
        {isCapturing ? '停止摄像头' : '开始摄像头'}
      </button>
      {isCapturing && (
        <>
          <video
            ref={videoRef}
            autoPlay
            className="w-[640px] h-[480px] mb-4"
          />
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={captureImage}
          >
            捕获并上传
          </button>
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            className="hidden"
          />
        </>
      )}
    </div>
  );
}

export default Camera;