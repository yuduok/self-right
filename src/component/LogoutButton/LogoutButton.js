"use client";
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

export default function LogoutButton() {
  const router = useRouter();
  const setLogoutState = useAuthStore((state) => state.setLogoutState);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setLogoutState();
    router.push('/login');
  };

  return <button onClick={handleLogout} className="bg-red-500 text-white font-bold py-2 px-4 rounded">退出登录</button>;
}