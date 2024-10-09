"use client";
import { useRouter } from 'next/navigation';
import useAuthStore from '../store/authStore';

export default function LogoutButton() {
  const router = useRouter();
  const setLogoutState = useAuthStore((state) => state.setLogoutState);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setLogoutState();
    router.push('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
}