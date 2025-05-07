"use client";
import React from "react";
import { FaUser, FaCheck, FaCheckDouble, FaLink, FaCogs } from "react-icons/fa";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { postConnection } from "@/services/ltiService";

function AssignmentCard({
  id,
  title,
  type,
  accepted,
  submissions,
  enabled,
  invite,
  ltiData,
  orgId,
  orgName,
  classroom
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleCopy = () => {
    navigator.clipboard
      .writeText(invite)
      .then(() => {
        alert("¡Enlace copiado!");
      })
      .catch((err) => {
        console.error("Error al copiar: ", err);
      });
  };

  const handleConnection = async () => {
     await postConnection(ltiData, id, classroom, orgId, orgName, invite)
     router.push(`${pathname}/${id}/configurar`);
  }

  return (
    <div className="bg-background w-full h-24 shadow-md rounded-md py-5 px-8 text-primary flex justify-center items-center gap-2">
      <div className="flex flex-col w-2/3 gap-2 ">
        <Link
          href={`${pathname}/${id}`}
          className="text-lg font-bold hover:underline"
        >
          {title}
        </Link>
        <div className="flex gap-5 font-medium">
          <span className="flex text-sm items-center gap-1 ">
            <FaUser />
            <p>{type}</p>
          </span>
          <span className="flex text-sm items-center gap-1">
            <FaCheck />
            <p>{accepted} aceptados</p>
          </span>
          <span className="flex text-sm items-center gap-1">
            <FaCheckDouble />
            <p>{submissions} entregados</p>
          </span>
          {enabled ? (
            <button className="w-20 text-xs text-white font-medium bg-accent  rounded-md shadow-md ">
              Activo
            </button>
          ) : (
            <button className="w-20 text-xs text-primary font-medium bg-secondary   rounded-md shadow-md ">
              Inactivo
            </button>
          )}
        </div>
      </div>

      {ltiData ? (
        <div className="flex flex-col w-1/3 gap-3 items-end text-white text-sm">
          <button
            onClick={handleConnection}
            className="flex items-center w-2/3 justify-center gap-2 bg-primary hover:bg-primary-hover  py-1 rounded"
          >
            <FaLink />
            Conectar
          </button>
        </div>
      ) : (
        <div className="flex flex-col w-1/3 gap-3 items-end text-white text-sm">
          <button
            onClick={handleCopy}
            className="flex items-center w-2/3 justify-center gap-2 bg-primary hover:bg-primary-hover  py-1 rounded"
          >
            <FaLink />
            Copiar invitacion
          </button>
          <Link
            href={`${pathname}/${id}/configurar`}
            className="flex items-center w-2/3  justify-center gap-2 bg-primary hover:bg-primary-hover py-1 rounded"
          >
            <FaCogs />
            Configurar
          </Link>
        </div>
      )}
    </div>
  );
}

export default AssignmentCard;
