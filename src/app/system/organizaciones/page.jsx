"use client";
import Loading from "@/components/loader/Loading";
import OrgTable from "@/components/tables/OrgTable";
import OrgUsersTable from "@/components/tables/OrgUsersTable";
import UsersTable from "@/components/tables/UsersTable";
import {
  getOrganizations,
  getOrgUsers,
  getTeachers,
  toggleOrganization,
  updateOrgAdmin,
  updateUserStatus,
} from "@/services/githubService";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";

function organizaciones() {
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState();
    const [globalFilter, setGlobalFilter] = useState(""); //Filtro de buscador
    // Filtrar submissions
    const filteredOrg = organizations.filter((org) =>
      org.orgName.toLowerCase().startsWith(globalFilter.toLowerCase())
    );
      const [pendingAction, setPendingAction] = useState({
        orgId: null,
        status: null,
      });

  const getData = async () => {
    console.log("hola");
    try {
      setLoading(true);
      const response = await getOrganizations();
      if (response) {
        console.log(response);
        setOrganizations(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

    const handleStatusChange = async (orgId, status) => {
    // Modal de confirmacion
    setPendingAction({ orgId, status });
    setShowConfirmModal(true);
  };


  const confirmStatusChange = async () => {
    try {
      
      setShowConfirmModal(false);
      const res = await toggleOrganization(pendingAction.orgId, pendingAction.status);
      await getData();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
       <div className="bg-background font-primary font-bold h-full flex flex-col items-center gap-5 w-full p-2 lg:p-5 py-8 overflow-clip">
      <div className="w-full flex flex-col items-center gap-2  text-primary">
        <h1 className="text-2xl font-bold text-center">Administrar organizaciones</h1>
        <p className="font-light text-center">
          Habilita o deshabilita organizaciones
        </p>
      </div>

      {loading ? (
        <Loading message={"Cargando..."} />
      ) : (
        <div className="w-4/5 flex flex-col lg:flex-row lg:w-full lg:justify-center  gap-2 mt-2 ">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className=" px-3 py-2 border-2 border-none bg-[#dcdcdc] rounded w-full lg:w-[40%] font-normal "
          />
        </div>
      )}

      {organizations.length === 0 ? (
        <div
          className={`bg-white w-4/5 mt-16  h-1/2 lg:w-1/2 flex flex-col gap-1 justify-center items-center p-6 rounded  text-center shadow-[0px_8px_8px_rgba(0,0,0,0.25)] ${
            loading ? "hidden" : ""
          }`}
        >
          <FaRegCircleXmark className="text-5xl " />
          <h1 className="text-2xl text-primary font-bold">
            Usuarios no encontrados
          </h1>
        </div>
      ) : (
        <div className="w-full   h-full lg:overflow-y-auto">
          {!loading && (
            <OrgTable
              organizations={filteredOrg}
              handleStatusChange={handleStatusChange}
            />
          )}
        </div>
      )}
      {showConfirmModal && (
 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-white w-full lg:w-1/4 flex flex-col gap-1 justify-center items-center p-6 rounded  text-center shadow-[0px_8px_8px_rgba(0,0,0,0.25)]">
            <FaRegQuestionCircle className="text-5xl" />
            <h1 className="text-2xl text-primary font-bold">
              Administrar usuarios
            </h1>
            <p className="text-primary text-lg font-medium mb-2">
              ¿Está seguro de transferir permisos de administrador?
            </p>
            <div className="w-full flex gap-2 justify-center items-center">
              <button
                className="flex w-1/3 lg:w-1/3   items-center justify-center gap-2 font-semibold bg-white border-2 border-secondary text-secondary hover:text-white px-5 hover:bg-secondary py-1 rounded shadow-lg"
                onClick={() => confirmStatusChange()}
              >
                Si
              </button>
              <button
                className="flex w-1/3 lg:w-1/3   items-center justify-center gap-2 font-semibold bg-white border-2 border-secondary text-secondary hover:text-white px-5 hover:bg-secondary py-1 rounded shadow-lg"
                onClick={() => setShowConfirmModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default organizaciones;
