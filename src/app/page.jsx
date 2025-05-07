'use client'; // Necesario para usar hooks y el cliente-side

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthCard from '../components/Login/AuthCard';

export default function LoginPage() {
  // Extrae el token directamente en el cliente
  const token = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search).get('token')
    : null;

  useEffect(() => {
    if (token) {
      window.sessionStorage.setItem('jwtToken', token);
    }
  }, [token]);

  return (
    <main 
      className="w-full h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ 
        backgroundImage: "url('/Fondo_Login.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
      <AuthCard />
    </main>
  );
}