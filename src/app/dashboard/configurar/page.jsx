"use client";
import Loading from "@/components/loader/Loading";
import OrgUsersTable from "@/components/tables/OrgUsersTable";
import UsersTable from "@/components/tables/UsersTable";
import {
  getOrgUsers,
  getTeachers,
  updateOrgAdmin,
  updateUserStatus,
} from "@/services/githubService";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

function configurar() {
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState();
  const [selectedOrg, setSelectedOrg] = useState();
  const [users, setUsers] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState({
    orgId: null,
    userId: null,
  });
  const { data: session, status } = useSession(); 

  const getData = async (orgId) => {
    try {
      setLoading(true);
      const response = await getTeachers(orgId);
      if (response) {
        console.log(response);
        setUsers(response);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (orgId, userId, status) => {
    try {
      await updateUserStatus(orgId, userId, status);
      getData(selectedOrg);
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
      await getData(selectedOrg);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" ) {
      setSelectedOrg(session.user.selectedOrgId)
      getData(session.user.selectedOrgId)
    } else if (status === "loading") {
      // Sesión aún cargando
      setLoading(true);
    }
  }, [status]); 



  return (
    <div className="bg-background flex flex-col gap-5 w-full h-full p-8 ">

      <div className="w-full text-primary ">
        <h1 className="text-2xl font-mono font-bold">Administrar usuarios</h1>
      </div>

      <div className="w-full h-11/12 bg-white shadow-xl">
        {loading ? (
          <Loading />
        ) : (
          <div>
            {users.length === 0 ? (
              <h1>No se encontraron usuarios</h1>
            ) : (
              <OrgUsersTable
                users={users}
                orgId={selectedOrg}
                handleStatusChange={handleStatusChange}
                handleAdminChange={handleAdminChange}
              />
            )}
          </div>
        )}

        
      {/* Modal de confirmación -------------------------------------------*/}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg text-center">
              <p className="text-primary text-lg font-semibold mb-2">
                Esta seguro que desea transferir los permisos de administrador?
              </p>
              <div className="flex gap-5 w-full justify-center">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="mt-2 px-4 py-1 bg-primary text-white rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => confirmAdminChange()}
                  className="mt-2 px-4 py-1 bg-primary text-white rounded"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default configurar;
