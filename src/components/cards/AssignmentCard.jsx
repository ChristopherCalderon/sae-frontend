'use client';
import React from "react";
import { FaUser, FaCheck, FaCheckDouble, FaLink, FaCogs } from "react-icons/fa";

import { usePathname } from "next/navigation";
import Link from "next/link";

function AssignmentCard() {
  const pathname = usePathname();
  return (
    <div className="bg-background w-full h-24 shadow-md rounded-md py-5 px-8 text-primary flex justify-center items-center gap-2">
      <div className="flex flex-col w-2/3 gap-2 ">
        <Link href={`${pathname}/nombretarea`} className="text-lg font-bold hover:underline">Tarea de programacion</Link>
        <div className="flex gap-5 font-medium">
          <span className="flex text-sm items-center gap-1 ">
            <FaUser />
            <p>Individual</p>
          </span>
          <span className="flex text-sm items-center gap-1">
            <FaCheck />
            <p>120 aceptados</p>
          </span>
          <span className="flex text-sm items-center gap-1">
            <FaCheckDouble />
            <p>60 entregados</p>
          </span>
          <button className="w-20 text-xs text-white font-medium bg-accent  rounded-md shadow-md ">
            Activo
          </button>
        </div>
      </div>

      <div className="flex flex-col w-1/3 gap-3 items-end text-white text-sm">
        <button className="flex items-center w-2/3 justify-center gap-2 bg-primary hover:bg-primary-hover  py-1 rounded">
          <FaLink />
          Copiar invitacion
        </button>
        <Link href={`${pathname}/nombretarea/configurar`}  className="flex items-center w-2/3  justify-center gap-2 bg-primary hover:bg-primary-hover py-1 rounded">
          <FaCogs />
          Configurar
        </Link>
      </div>
    </div>
  );
}

export default AssignmentCard;
