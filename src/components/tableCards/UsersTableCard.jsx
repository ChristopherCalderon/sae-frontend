"use client";
import { getRepoData, postFeedback } from "@/services/githubService";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

function UsersTableCard({
  user,
  orgId,
  handleStatusChange,
  handleAdminChange,
}) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const [showActions, setShowActions] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white flex w-full  rounded-md flex-col   text-primary  justify-center  shadow-[0px_8px_8px_rgba(0,0,0,0.25)] lg:hidden ">
      <div className="w-full flex">
        <div className="bg-[#dcdcdc] h-full rounded-tl-md  w-2/5 p-2 flex items-center justify-center text-center text-sm ">
          <h1>Usuario</h1>
        </div>
        <div className="bg-white h-full py-3    w-3/5 flex items-center justify-center  gap-1 ">
          <img
            src="https://avatars.githubusercontent.com/u/149279708?v=4"
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
          <h1>Rol</h1>
        </div>
        <div className="bg-white h-full py-3    w-3/5 flex items-center justify-center  gap-1 ">
          <div className=" flex flex-col text-sm font-medium ">
            <p>{user.role}</p>
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
                user.isActive ? "bg-secondary" : "bg-red-500"
              }`}
            ></div>
            <p className="text-xs md:text-sm">
              {user.isActive ? "Habilitado" : "Inhabilitado"}
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
            {user.isActive && user.role === "Teacher" && (
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
                handleStatusChange(orgId, user._id, !user.isActive);
              }}
              className="block w-full text-left text-sm text-primary px-4 py-2 hover:bg-gray-100"
            >
              Cambiar estado
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersTableCard;
