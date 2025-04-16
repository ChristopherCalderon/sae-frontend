import React from "react";
import { HiAcademicCap } from "react-icons/hi";
import { FaExternalLinkAlt } from "react-icons/fa";

function ClassCard() {
  return (
    <div className="bg-background w-full h-40 shadow-md rounded-md py-5 px-8 text-primary flex flex-col items-center gap-2">
      <div className="w-full flex items-center justify-center gap-8">
        <HiAcademicCap className="text-4xl" />
        <h1 className="font-bold w-2/3 hover:underline">
          PROGRAMACION-DE-ESTRUCTURAS-DINAMICAS-Sección-01-CICLO-02/2025
        </h1>
      </div>
      <button className="w-20 text-sm text-white font-bold bg-accent px-2 py-1 rounded-md shadow-md ">
        Active
      </button>
      <a
        href="https://github.com/tu-usuario/tu-repo"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold hover:font-bold hover:underline flex justify-center items-center gap-1"
      >
        Ver Classroom
        <FaExternalLinkAlt  className="text-md"/>
      </a>
    </div>
  );
}

export default ClassCard;
