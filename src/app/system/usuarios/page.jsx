"use client";
import Loading from "@/components/loader/Loading";
import UsersTable from "@/components/tables/UsersTable";
import { getOrgUsers, updateUserStatus } from "@/services/githubService";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

function usuarios() {
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState();
  const [selectedOrg, setSelectedOrg] = useState();
  const [users, setUsers] = useState([]);
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
              await updateUserStatus(orgId, userId, status)
              getData();
          } catch (error) {
              console.log(error)
          }
      }

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
    <div className="bg-background flex flex-col gap-5 w-full h-full p-8 ">
      <div className="w-full text-primary ">
        <h1 className="text-2xl font-mono font-bold">Administrar usuarios</h1>
      </div>

      <div className="w-full h-11/12 bg-white shadow-xl">
        {loading ? (
          <Loading />
        ) : (
          <div>
            <div className="relative mt-2">
              <select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="w-full px-3 py-2 bg-background rounded appearance-none focus:outline-none shadow-md"
              >
                <option value="">Seleccionar proveedor</option>
                {organizations.map((org) => (
                  <option key={org.orgId} value={org.orgId}>
                    {org.orgName}
                  </option>
                ))}
              </select>
              <IoIosArrowDown className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-lg text-gray-600" />
            </div>
            {users.length === 0 ? (
              <h1>No se encontraron usuarios</h1>
            ) : (
              <UsersTable users={users} orgId={selectedOrg} handleStatusChange={handleStatusChange}/>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default usuarios;
