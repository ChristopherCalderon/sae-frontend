"use client";
import React from "react";
import { HiAcademicCap } from "react-icons/hi";
import { FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

function ClassCard({ id, name, url, status }) {
  const pathname = usePathname();
  return (
    <div className="bg-background w-full h-40 shadow-md rounded-md py-5 px-8 text-primary flex flex-col items-center gap-2">
      <div className="w-full flex items-center justify-center gap-8">
        <HiAcademicCap className="text-4xl" />
        <Link
          href={`${pathname}/${name}`}
          className="font-bold w-2/3 hover:underline"
        >
          {name}
        </Link>
      </div>
      {!status ? (
        <button className="w-20 text-sm text-white font-bold bg-accent px-2 py-1 rounded-md shadow-md ">
          Activo
        </button>
      ) : (
        <button className="w-20 text-sm text-white font-bold bg-accent px-2 py-1 rounded-md shadow-md ">
          Inhabilitado
        </button>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold hover:font-bold hover:underline flex justify-center items-center gap-1"
      >
        Ver Classroom
        <FaExternalLinkAlt className="text-md" />
      </a>
    </div>
  );
}

export default ClassCard;
