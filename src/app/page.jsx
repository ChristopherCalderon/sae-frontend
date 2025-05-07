'use client'; // Necesario para usar hooks y el cliente-side

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthCard from '../components/Login/AuthCard';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      try {
        // Almacenar en sessionStorage
        window.sessionStorage.setItem('jwtToken', token);
        
        // Limpiar la URL sin recargar
        // const newUrl = window.location.origin + window.location.pathname;
        // window.history.replaceState({}, '', newUrl);
        
      } catch (error) {
        console.error('Error almacenando el token:', error);
      }
    }
  }, [searchParams, router]);

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