"use client";
import { getRepoData, postFeedback } from "@/services/githubService";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";




function OrgTableCard({ organization, handleStatusChange }) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  return (
    <div className="bg-white flex w-full  rounded-md flex-col   text-primary  justify-center  shadow-[0px_8px_8px_rgba(0,0,0,0.25)] lg:hidden ">
      <div className="w-full flex ">
        <div className="bg-[#dcdcdc] h-full rounded-tl-md  w-2/5 p-2 flex items-center justify-center text-center text-sm ">
          <h1>Organizacion</h1>
        </div>
        <div className="bg-white h-full py-6    w-3/5 flex items-center justify-center  gap-1 ">
          <div className=" flex flex-col text-sm font-medium ">
            <p>{organization.orgName}</p>
          </div>
        </div>
      </div>

      <div className="w-full flex">
        <div className="bg-[#dcdcdc] h-full w-2/5 p-2 py-6 flex items-center justify-center text-sm">
          <h1>Estado</h1>
        </div>
        <div className="bg-white h-full w-3/5 flex items-center justify-center  gap-1  text-sm font-medium">
          <div className="flex items-center gap-2 justify-center">
            <div
              className={`w-4 h-4 rounded-full ${
                organization.isActive ? "bg-secondary" : "bg-red-500"
              }`}
            ></div>
            <p className="text-xs md:text-sm">
              {organization.isActive
                ? "Organización habilitada"
                : "Organización inhabilitada"}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => handleStatusChange(organization.orgId, organization.isActive)}
        className=" w-full text-center border-secondary border-2 text-secondary hover:bg-secondary hover:text-white  font-bold  px-3 py-2 rounded"
      >
        {organization.isActive ? "Inhabilitar" : "Habilitar"}
      </button>
    </div>
  );
}

export default OrgTableCard;
