'use client'; // Necesario para usar hooks y el cliente-side

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthCard from '../components/Login/AuthCard';
import { signOut, getSession } from 'next-auth/react';


export default function LoginPage() {
  // Extrae el token directamente en el cliente
  const token = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search).get('token')
    : null;

  useEffect(() => {
    const checkAndLogout = async () => {
      const session = await getSession();
      if (session) {
        await signOut({ redirect: false });
      }
    };

    checkAndLogout();

    if (token) {
      window.sessionStorage.setItem('jwtToken', token);
    }
  }, [token]);

  return (
    <main 
      className="w-full h-screen bg-cover bg-center flex items-center justify-center p-4 bg-background">
      <AuthCard />
    </main>
  );
}