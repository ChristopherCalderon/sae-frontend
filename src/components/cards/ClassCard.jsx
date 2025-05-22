"use client";
import React from "react";
import { HiAcademicCap } from "react-icons/hi";
import { FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

function ClassCard({ id, name, url, status }) {
  const pathname = usePathname();

    const getFontSize = (text) => {
    const length = text?.length || 0;

    if (length > 50) return "text-sm"; 
    if (length > 40) return "text-base"; 
    if (length > 30) return "text-lg"; 
    return "text-xl"; 
  };
  const fontSizeClass = getFontSize(name);
  return (
    <div className="bg-white w-full h-50 rounded-md px-4  text-primary flex flex-col justify-center gap-10 shadow-[0px_8px_8px_rgba(0,0,0,0.25)] ">
      {/* Estado de tarea */}
      {!status ? (
        <button className="bg-white border-2 border-secondary  py-1 px-4 w-fit rounded-lg font-semibold text-sm text-secondary text-center ">
          Activo
        </button>
      ) : (
        <button className="bg-white border-2 border-secondary  py-1 px-4 w-fit rounded-lg font-semibold text-sm text-secondary text-center">
          Inhabilitado
        </button>
      )}

      {/* Titulo de tarea */}

      <Link
        href={`${pathname}/${id}`}
        className={`${fontSizeClass} text-center font-bold text-md break-words whitespace-normal hover:underline`}
      >
        {name}
      </Link>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold hover:font-bold hover:underline flex justify-center items-center gap-1 text-secondary justify-end" 
      >
        Ver Classroom
        <FaExternalLinkAlt className="text-md" />
      </a>
    </div>
  );
}

export default ClassCard;
