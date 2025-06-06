"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  FaBrain,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChalkboardTeacher,
  FaBuilding,
  FaLayerGroup,
} from "react-icons/fa";
import { GiBrain } from "react-icons/gi";
import { HiAcademicCap } from "react-icons/hi";
import { useState, useEffect } from "react";
import Image from "next/image";

function SysNavbar() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user.activeRole === "ORG_Admin";
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Efecto para detectar el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px como breakpoint para tablet
    };

    // Ejecutar al montar y añadir listener
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Contenido del menú
  const menuContent = (
    <>
      <div className="h-1/4 w-full ">
        <div className="w-full px-2 py-3">
          <div className="flex flex-col w-full items-center gap-2">
            <img
              className="rounded-full w-16"
              src={session?.user.image}
              alt="Picture of the author"
            />
            <span className="font-semibold w-full text-center text-sm break-words whitespace-normal">
              {session?.user?.name || "Nombre de usuario"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex h-3/5  lg:h-3/4 flex-col justify-between p-2 text-xl font-semibold">
        <div className="h-full flex flex-col gap-4">
          <Link
            href={"/system/usuarios"}
            className="flex lg:flex-col  justify-center text-center items-center gap-1 text-sm cursor-pointer hover:bg-primary hover:text-white p-2 rounded"
            onClick={() => isMobile && setIsOpen(false)}
          >
            <FaUsers className="text-2xl" />
            <span>Usuarios</span>
          </Link>
          <Link
            href={"/system/organizaciones"}
            className="flex lg:flex-col justify-center text-center items-center gap-1 text-sm cursor-pointer hover:bg-primary hover:text-white p-2 rounded"
            onClick={() => isMobile && setIsOpen(false)}
          >
            <FaBuilding className="text-2xl" />
            <span>Organizaciones</span>
          </Link>

          <Link
            href={"/system/proveedores"}
            className="flex lg:flex-col justify-start gap-4  px-8 lg:px-0 lg:justify-center text-center items-center lg:gap-1 text-sm cursor-pointer hover:bg-primary hover:text-white p-2 rounded"
            onClick={() => isMobile && setIsOpen(false)}
          >
            <FaBrain className="text-2xl" />
            <span>Proveedores IA</span>
          </Link>
        </div>

        <div>
          <div
            onClick={() => {
              signOut({ callbackUrl: "/" });
              isMobile && setIsOpen(false);
            }}
            className="flex lg:flex-col justify-center text-center items-center gap-1 text-sm cursor-pointer hover:bg-primary hover:text-white p-2 rounded"
          >
            <FaSignOutAlt className="text-2xl" />
            <span>Cerrar sesion</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Versión desktop  */}
      <div className="hidden lg:block w-[9%] h-screen bg-[#2d3145] text-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
        {status === "loading" ? "" : menuContent}
      </div>

      {/* Versión mobile/tablet */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-50">
        {/* Botón hamburguesa */}
        <div
          className={`${
            isOpen ? "bg-[#2d3145] w-64" : "bg-background "
          } h-14 p-4 flex justify-between items-center`}
        >
          <button
            onClick={toggleMenu}
            className={`${
              !isOpen ? "text-[#2d3145]" : "text-background "
            } focus:outline-none`}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Menú desplegable */}
        {isOpen && (
          <div className="bg-[#2d3145] text-white h-screen w-64 shadow-lg overflow-y-auto">
            {menuContent}
          </div>
        )}
      </div>

      {/* Overlay para cuando el menú está abierto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default SysNavbar;
