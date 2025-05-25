"use client";
import Loading from "@/components/loader/Loading";
import UsersTable from "@/components/tables/UsersTable";
import {
  getOrgUsers,
  updateOrgAdmin,
  updateUserStatus,
} from "@/services/githubService";
import React, { useEffect, useState } from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FaCircleMinus, FaRegCircleXmark } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";

function usuarios() {
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState();
  const [selectedOrg, setSelectedOrg] = useState();
  const [users, setUsers] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState({
    orgId: null,
    userId: null,
  });

  const [globalFilter, setGlobalFilter] = useState(""); //Filtro de buscador
  // Filtrar submissions
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().startsWith(globalFilter.toLowerCase())
  );
  console.log(users);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getOrgUsers();
      if (response) {
        console.log(response.data);
        setOrganizations(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (orgId, userId, status) => {
    try {
      await updateUserStatus(orgId, userId, status);
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdminChange = async (orgId, userId) => {
    // Modal de confirmacion
    setPendingAction({ orgId, userId });
    setShowConfirmModal(true);
  };

  const confirmAdminChange = async () => {
    try {
      setShowConfirmModal(false);
      setLoading(true);
      await updateOrgAdmin(pendingAction.orgId, pendingAction.userId);
      await getData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  //Observa el cambio de la org seleccionada
  useEffect(() => {
    if (selectedOrg) {
      setLoading(true);
      const selectedOrganization = organizations.find(
        (org) => org.orgId === selectedOrg
      );

      // Si encontró la organización, actualiza los usuarios
      if (selectedOrganization) {
        setUsers(selectedOrganization.users);
        setLoading(false);
      } else {
        setUsers([]); // Si no hay organización seleccionada, limpia los usuarios
        setLoading(false);
      }
    } else {
      setUsers([]); // Si no hay organización seleccionada, limpia los usuarios
    }
  }, [selectedOrg, organizations]);

  return (
    <div className="bg-background font-primary font-bold h-full flex flex-col items-center gap-5 w-full p-2 lg:p-5 py-8 overflow-clip">
      <div className="w-full flex flex-col items-center gap-2  text-primary">
        <h1 className="text-2xl font-bold text-center">Administrar usuarios</h1>
        <p className="font-light text-center">
          Selecciona una organización y administra sus usuarios
        </p>
      </div>

      {loading ? (
        <Loading message={"Cargando..."} />
      ) : (
        <div className="w-4/5 flex flex-col lg:flex-row lg:w-full lg:justify-between  gap-2 mt-2 ">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className=" px-3 py-2 border-2 border-none bg-[#dcdcdc] rounded w-full lg:w-[40%] font-normal "
          />
          <div className="relative lg:flex lg:justify-end lg:w-1/2">
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="w-full lg:w-[80%] px-3 py-2 bg-white rounded appearance-none focus:outline-none shadow-md font-normal"
            >
              <option value="">Seleccionar organización</option>
              {organizations.map((org) => (
                <option key={org.orgId} value={org.orgId}>
                  {org.orgName}
                </option>
              ))}
            </select>
            <IoIosArrowDown className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-2xl text-secondary" />
          </div>
        </div>
      )}

      {users.length === 0 ? (
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
            <UsersTable
              users={filteredUsers}
              orgId={selectedOrg}
              handleStatusChange={handleStatusChange}
              handleAdminChange={handleAdminChange}
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
                 onClick={() => confirmAdminChange()}
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

export default usuarios;
