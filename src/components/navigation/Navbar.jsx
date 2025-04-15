import React from "react";
import { FaBrain, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { GiBrain } from "react-icons/gi";
import { HiAcademicCap } from "react-icons/hi";
import Image from "next/image";

function Navbar() {
  return (
    <div className="w-[14.3%] h-screen bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] flex flex-col">
      
      <div className="h-1/5 w-full relative">
        <figure className="absolute w-full h-full z-10">
          <Image src="/fachada.jpg" alt="fachada" fill />
        </figure>

        <div className="w-full h-2/3 bg-black/50 absolute bottom-0 z-10 text-white px-2 py-3">
          <h1 className="font-bold text-md text-center leading-tight">
            Sistema Automatizado de Evaluación
          </h1>
          <div className="flex w-full items-center gap-2 mt-2">
            <FaUser />
            <span className="text-sm">Nombre de usuario</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-2 text-primary text-xl font-bold flex-1">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-primary hover:text-white p-2 rounded">
          <GiBrain />
          <span>Modelos IA</span>
        </div>

        <div className="flex items-center gap-3 cursor-pointer hover:bg-primary hover:text-white p-2 rounded">
          <HiAcademicCap />
          <span>Mis clases</span>
        </div>

        <div className="flex items-center gap-3 cursor-pointer hover:bg-primary hover:text-white p-2 rounded">
          <FaCog />
          <span>Configuración</span>
        </div>
      </div>

      <div className="p-4 text-blue-900 text-xl font-bold">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-primary hover:text-white p-2 rounded">
          <FaSignOutAlt />
          <span>Cerrar sesion</span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
