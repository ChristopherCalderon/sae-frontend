"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FaBrain, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { GiBrain } from "react-icons/gi";
import { HiAcademicCap } from "react-icons/hi";
import Image from "next/image";

function Navbar() {
  const { data: session, status } = useSession(); 
  const isAdmin = session?.user.activeRole === "ORG_Admin"; // Verificamos si el rol es 'admin'

  return (
    <div className="w-[14.3%] h-screen bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] flex flex-col">
      <div className="h-1/5 w-full relative">
        <figure className="absolute w-full h-full z-10">
          <Image src="/fachada.jpg" alt="fachada" fill />
        </figure>

        <div className="w-full h-2/3 bg-black/50 absolute bottom-0 z-10 text-white px-2 py-3">
          <h1 className="font-mono font-bold text-md text-center leading-tight">
            Sistema Automatizado de Evaluación
          </h1>
          <div className="flex w-full items-center gap-2 mt-2">
            <FaUser />
            <span className="font-mono text-sm">
              {session?.user?.name || "Nombre de usuario"}
            </span>
          </div>
          <span>
          {session?.user?.selectedOrg || "Nombre de usuario"}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-2 text-primary text-xl font-semibold flex-1">
        <Link
          href={"/dashboard/clases"}
          className="font-mono flex items-center gap-3 cursor-pointer hover:bg-primary hover:text-white p-2 rounded"
        >
          <HiAcademicCap />
          <span>Mis clases</span>
        </Link>
        <Link
            href={"/dashboard/modelo"}
            className="font-mono flex items-center gap-3 cursor-pointer hover:bg-primary hover:text-white p-2 rounded"
          >
            <GiBrain />
            <span>Mis Modelos IA</span>
          </Link>
        {/* Mostrar "Modelos IA" solo si es admin */}
        {isAdmin && (
          <Link
            href={"/dashboard/modelos"}
            className="font-mono flex items-center gap-3 cursor-pointer hover:bg-primary hover:text-white p-2 rounded"
          >
            <GiBrain />
            <span>Modelos IA de Org</span>
          </Link>
        )}

        {isAdmin && (
          <Link
            href={"/dashboard/admin"}
            className="font-mono flex items-center gap-3 cursor-pointer hover:bg-primary hover:text-white p-2 rounded"
          >
            <FaCog />
            <span>Secciones</span>
          </Link>
        )}

                {isAdmin && (
          <Link
            href={"/dashboard/configurar"}
            className="font-mono flex items-center gap-3 cursor-pointer hover:bg-primary hover:text-white p-2 rounded"
          >
            <FaCog />
            <span>Configuración</span>
          </Link>
        )}
        
      </div>

      <div className="p-4 text-blue-900 text-lg font-bold">
        <div
          onClick={() => {
            signOut({ callbackUrl: "/" }); // Redirige al login o página principal después de cerrar sesión
          }}
          className="font-mono flex items-center gap-3 cursor-pointer hover:bg-primary hover:text-white p-2 rounded"
        >
          <FaSignOutAlt />
          <span>Cerrar sesion</span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
