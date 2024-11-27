"use client";
import { useState,useEffect } from "react";
import SideBar from "@/component/sideBar/sideBar";
import LogoutButton from "@/component/LogoutButton/LogoutButton";
import useAuthStore from "@/store/authStore";

const Layout = ({ children }) => {

  const [userType, setUserType] = useState(null);

  const getUserType = async () => {
    const {token} = useAuthStore.getState();
    if (!token) {
      return;
    }
    // console.log(token);
    try {
      const response = await fetch("/api/userType",
        {
          method: "POST",
          headers:{
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token
          })
        }
      );
      const data = await response.json();
      if (data.code === "0") {
        setUserType(data.data);
      }
    } catch (error) {
      console.error("Error fetching user type:", error);
    }
  };
  
  useEffect(() => {
    getUserType();
  },
  []);

  return (
    <div className="flex h-screen relative">
      <SideBar userType={userType} />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
      <div className="absolute top-0 right-0 m-4">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Layout;