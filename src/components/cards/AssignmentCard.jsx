"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  FaUser,
  FaCheck,
  FaCheckDouble,
  FaCogs,
  FaShareAlt,
  FaRegCheckCircle,
} from "react-icons/fa";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { postConnection } from "@/services/ltiService";
import { HiDotsVertical } from "react-icons/hi";

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
  classroom,
  linkedTasks = [],
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState();
  const menuRef = useRef(null);
  const [showSuccessModal, setShowSuccessModal] = useState("");

  const handleCopy = () => {
    navigator.clipboard
      .writeText(invite)
      .then(() => {
        setShowSuccessModal("Enlace copiado");
        setTimeout(() => {
          setShowSuccessModal("");
        }, 2000);
      })
      .catch((err) => {
        console.error("Error al copiar: ", err);
      });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleConnection = async () => {
    await postConnection(ltiData, id, classroom, orgId, orgName, invite);
    router.push(`${pathname}/${id}/configurar`);
  };

  const getFontSize = (text) => {
    const length = text?.length || 0;

    if (length > 50) return "text-sm";
    if (length > 40) return "text-base";
    if (length > 30) return "text-lg";
    if (length > 15) return "text-xl";
    return "text-2xl";
  };
  const fontSizeClass = getFontSize(title);

  return (
    <div
      className={`bg-white relative w-full h-50 rounded-md px-4  text-primary flex flex-col justify-center gap-10 shadow-[0px_8px_8px_rgba(0,0,0,0.25)] ${
        linkedTasks.includes(id.toString()) && ltiData && "hidden"
      }`}
    >
      {/* Vineta y configuracion */}
      <div className="flex justify-between">
        {enabled ? (
          <button className="bg-white border-2 border-secondary  py-1 px-4 w-fit rounded-lg font-semibold text-sm text-secondary text-center  ">
            Activo
          </button>
        ) : (
          <button className="bg-white border-2 border-secondary  py-1 px-4 w-fit rounded-lg font-semibold text-sm text-secondary text-center ">
            Inactivo
          </button>
        )}

        <HiDotsVertical
          className="text-xl text-secondary cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />

        {/* Menú desplegable */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <div className="py-1">
              {ltiData ? (
                <button
                  onClick={handleConnection}
                  className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                    linkedTasks.includes(id.toString()) && "hidden"
                  }`}
                >
                  Conectar
                </button>
              ) : (
                <button
                  onClick={() => {
                    router.push(`${pathname}/${id}/configurar`);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Configurar
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Titulo */}
      {ltiData ? (
        <h1
          href={`${pathname}/${id}`}
          className={`${fontSizeClass} text-center font-bold text-md break-words whitespace-normal `}
        >
          {title}
        </h1>
      ) : (
        <Link
          href={`${pathname}/${id}`}
          className={`${fontSizeClass} text-center font-bold text-md break-words whitespace-normal hover:underline`}
        >
          {title}
        </Link>
      )}

      {/* Datos y url */}

      <div className="flex  items-center justify-between">
        <div className="flex w-full gap-5">
          <span className="flex text-sm items-center gap-1">
            <FaCheck />
            <span className="text-xs md:text-sm lg:text-sm flex gap-1">
              {accepted} <p className="hidden md:block lg:block">Aceptados</p>{" "}
            </span>
          </span>
          <span className="flex text-sm items-center gap-1">
            <FaCheckDouble />
            <span className="text-xs md:text-sm lg:text-sm flex gap-1">
              {submissions}{" "}
              <p className="hidden md:block lg:block">Entregados</p>{" "}
            </span>
          </span>
        </div>

        <FaShareAlt className="text-xl text-secondary" onClick={handleCopy} />
      </div>

      {/* Modal de exito-------------------------- */}
      {showSuccessModal != "" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-white w-full lg:w-1/4 flex flex-col gap-1 justify-center items-center p-6 rounded  text-center shadow-[0px_8px_8px_rgba(0,0,0,0.25)]">
            <FaRegCheckCircle className="text-5xl" />
            <h1 className="text-2xl text-primary font-bold">
              {showSuccessModal}
            </h1>
            <p className="text-primary text-lg font-medium mb-2">
              ¡Accion realizada con exito!
            </p>
          </div>
        </div>
      )}

      {/* {ltiData ? (
        <div className="flex flex-col w-1/3 gap-3 items-end text-white text-sm">
          <button
            onClick={handleConnection}
            className={`flex items-center w-2/3 justify-center gap-2 bg-primary hover:bg-primary-hover  py-1 rounded
               ${linkedTasks.includes(id.toString()) && "hidden"}`}
          >
            <FaLink />
            Conectar
          </button>
        </div>
      ) : (
        <div className="flex flex-col w-1/3 gap-3 items-end text-white text-sm">

          <Link
            href={`${pathname}/${id}/configurar`}
            className="flex items-center w-2/3  justify-center gap-2 bg-primary hover:bg-primary-hover py-1 rounded"
          >
            <FaCogs />
            Configurar
          </Link>
        </div>
      )} */}
    </div>
  );
}

export default AssignmentCard;
