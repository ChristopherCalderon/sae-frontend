"use client";
import { getRepoData, postFeedback } from "@/services/githubService";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { GiSpermWhale } from "react-icons/gi";
import { PiOpenAiLogoLight } from "react-icons/pi";
import { RiGeminiLine } from "react-icons/ri";

function OrgUsersTableCard({
  user,
  orgId,
  handleStatusChange,
  handleAdminChange,
}) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const [showActions, setShowActions] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //Icono de proveedor------------------------------------------------------------
  const getProviderIcon = (name, index) => {
    switch (name.toLowerCase()) {
      case "openai":
        return (
          <PiOpenAiLogoLight
            key={index}
            className="text-secondary h-[32px] w-[32px] md:h-[32px] md:w-[32px]"
          />
        );
      case "deepseek":
        return (
          <GiSpermWhale
            key={index}
            className="text-secondary h-[32px] w-[32px] md:h-[32px] md:w-[32px]"
          />
        );
      case "gemini":
        return (
          <RiGeminiLine
            key={index}
            className="text-secondary h-[32px] w-[32px] md:h-[32px] md:w-[32px]"
          />
        );
      default:
        return <div className="w-5 h-5" />;
    }
  };
  return (
    <div className="bg-white flex w-full  rounded-md flex-col   text-primary  justify-center  shadow-[0px_8px_8px_rgba(0,0,0,0.25)] lg:hidden ">
      <div className="w-full flex">
        <div className="bg-[#dcdcdc] h-full rounded-tl-md  w-2/5 p-2 flex items-center justify-center text-center text-sm ">
          <h1>Usuario</h1>
        </div>
        <div className="bg-white h-full py-3    w-3/5 flex items-center justify-center  gap-1 ">
          <img
            src={user.urlAvatar}
            alt="avatar"
            className="w-8 h-8  md:w-10 md:h-10 rounded-full"
          />
          <div className=" flex flex-col text-xs md:text-sm font-medium ">
            <p>{user.name}</p>
            <p className="font-normal text-[9px] md:text-sm break-words whitespace-normal">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full flex ">
        <div className="bg-[#dcdcdc] h-full rounded-tl-md  w-2/5 p-2 flex items-center justify-center text-center text-sm ">
          <h1>Modelos</h1>
        </div>
        <div className="bg-white h-full py-3    w-3/5 flex items-center justify-center  gap-1 ">
          {user.providers.length > 0 ? (
            <div className=" flex gap-2 text-sm font-medium ">
              {user.providers.map((provider, index) =>
                getProviderIcon(provider, index)
              )}
            </div>
          ) : (
            <p className="text-sm font-medium">No hay modelos asignados</p>
          )}
        </div>
      </div>

      <div className="w-full flex ">
        <div className="bg-[#dcdcdc] h-full rounded-tl-md  w-2/5 p-2 flex items-center justify-center text-center text-sm ">
          <h1>Rol</h1>
        </div>
        <div className="bg-white h-full py-3    w-3/5 flex items-center justify-center  gap-1 ">
          <div className=" flex flex-col text-sm font-medium ">
            <p>{user.organizations[0].role}</p>
          </div>
        </div>
      </div>

      <div className="w-full flex">
        <div className="bg-[#dcdcdc] h-full w-2/5 p-2 py-3 flex items-center justify-center text-sm">
          <h1>Estado</h1>
        </div>
        <div className="bg-white h-full w-3/5 flex items-center justify-center  gap-1  text-sm font-medium">
          <div className="flex items-center gap-2 justify-center">
            <div
              className={`w-4 h-4 rounded-full ${
                user.organizations[0].isActive ? "bg-secondary" : "bg-red-500"
              }`}
            ></div>
            <p className="text-xs md:text-sm">
              {user.organizations[0].isActive ? "Habilitado" : "Inhabilitado"}
            </p>
          </div>
        </div>
      </div>

      {/* Botón Administrar */}
      <div className="relative w-full">
        <button
          onClick={() => setShowActions((prev) => !prev)}
          className={`w-full text-center border-secondary border-2 text-secondary hover:bg-secondary hover:text-white font-bold px-3 py-2 rounded ${
            user.role === "ORG_Admin" ? "hidden" : ""
          }`}
        >
          Administrar
        </button>

        {/* Dropdown */}
        {showActions && (
          <div className="absolute z-20 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-full mt-2">
            {user.organizations[0].isActive &&
              user.organizations[0].role === "Teacher" && (
                <button
                  onClick={() => {
                    setShowActions(false);
                    handleAdminChange(orgId, user._id);
                  }}
                  className="block w-full text-left text-sm text-primary px-4 py-2 hover:bg-gray-100"
                >
                  Asignar Admin
                </button>
              )}
            <button
              onClick={() => {
                setShowActions(false);
                handleStatusChange(
                  orgId,
                  user._id,
                  !user.organizations[0].isActive
                );
              }}
              className="block w-full text-left text-sm text-primary px-4 py-2 hover:bg-gray-100"
            >
              Cambiar estado
            </button>
            <Link
              href={{
                pathname: `${pathname}/${user._id}`,
                query: {
                  data: btoa(
                    JSON.stringify({
                      email: user.email,
                      name: user.name,
                    })
                  ),
                },
              }}
              className="block w-full text-left text-sm text-primary px-4 py-2 hover:bg-gray-100"
            >
              Administrar modelos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrgUsersTableCard;
