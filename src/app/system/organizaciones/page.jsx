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
import { IoIosArrowDown } from "react-icons/io";

function organizaciones() {
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState();

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
    try {
      const res = await toggleOrganization(orgId, status);
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="bg-background flex flex-col gap-5 w-full h-full p-8 ">
      <div className="w-full text-primary ">
        <h1 className="text-2xl font-mono font-bold">
          Administrar organizaciones
        </h1>
      </div>

      <div className="w-full h-11/12 bg-white shadow-xl">
        {loading ? (
          <Loading />
        ) : (
          <div>
            {organizations.length === 0 ? (
              <h1>No se encontraron usuarios</h1>
            ) : (
              <OrgTable
                organizations={organizations}
                handleStatusChange={handleStatusChange}
              />
            )}
          </div>
        )}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg text-center">
              <p className="text-primary text-lg font-semibold mb-2">
                Esta seguro que desea transferir los permisos de administrador?
              </p>
              <div className="flex gap-5 w-full justify-center">
                <button className="mt-2 px-4 py-1 bg-primary text-white rounded">
                  Cancelar
                </button>
                <button className="mt-2 px-4 py-1 bg-primary text-white rounded">
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

export default organizaciones;
