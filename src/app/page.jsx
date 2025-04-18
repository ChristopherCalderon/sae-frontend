
import AuthCard from '../components/Login/AuthCard';

export default function LoginPage() {
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