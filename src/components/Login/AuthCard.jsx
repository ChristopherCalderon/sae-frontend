"use client";
import { FaGithub } from "react-icons/fa";
import { signIn, signOut, useSession } from "next-auth/react";
import GithubLoginButton from "./GithubLoginButton";
import { FaRegCopyright } from "react-icons/fa6";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AuthCard() {
  const { data: session } = useSession();

//   const [userInfo, setUserInfo] = useState(null);

//   useEffect(() => {
//     const fetchRole = async () => {
//         if (!session?.accessToken) {
//             console.log("No hay accessToken disponible");
//             return;
//           }

//       try {
//         const res = await axios.get(
//           'https://sae-backend-n9d3.onrender.com/repo/whoami',
//           {
//             params: {
//               org: 'ProyectoGraduacionUCA',
//             },
//             headers: {
//               Authorization: `Bearer ${session.accessToken}`,
//             },
//           }
//         );

//         setUserInfo(res.data);
//       } catch (error) {
//         console.error('Error al obtener el rol:', error);
//       }
//     };

//     fetchRole();
//   }, [session]);

//   console.log(userInfo)

  return (
    <div className="text-center space-y-6  bg-white/80 px-10 py-20 rounded-lg">
      <img src="/logo-uca.png" alt="Logo UCA" className="mx-auto h-30" />
      <h3 className="font-mono font-bold text-[24px] text-primary">
        Sistema Automatizado de Evaluación
      </h3>
      <p className="font-mono font-normal text-[13px] text-primary">
        Ingrese con su cuenta de GitHub
      </p>
      <div className="flex justify-center">
        <button
          onClick={() => signIn("github")}
          className="font-mono font-normal bg-black text-[13px] text-white flex items-center justify-center px-4 py-2 rounded-md 
                            shadow hover:bg-gray-800 transition"
        >
          <FaGithub className="mr-2" />
          Login with GitHub
        </button>
      </div>
      <div className="flex justify-center mt-20">
        <FaRegCopyright className="mr-2" />
        <p className="font-mono text-[13px] text-black">
          2025 - Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
