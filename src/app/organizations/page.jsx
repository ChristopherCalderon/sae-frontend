"use client";
import { useSession } from "next-auth/react";
import React from "react";

function organizationSelect() {
  const { data: session, status, update } = useSession();

  if (status === "loading") {
    return <div>Cargando sesión...</div>; // O algún spinner de carga
  }

  if (!session || !session.user.organizations) {
    return <div>No se encontraron organizaciones.</div>;
  }

  
  const handleSelectOrg = async (orgId, orgRole) => {
    // Tu lógica para seleccionar la organización
    console.log("Organización seleccionada:", orgId);
    console.log("Rol:", orgRole);
    console.log("ANTES:", session.user.activeRole);
    await update({
        activeRole: orgRole,
        selectedOrg: orgId
      });
      console.log("DESPUES:", session.user.activeRole);
      
console.log("Rol actualizado:", orgRole);
  };
  return (
    <div className="bg-background h-screen flex flex-col gap-5 w-full p-8 overflow-clip">
      <div className="w-full text-primary ">
        <h1 className="text-2xl font-bold">Mis Clases</h1>
        <p className="font-semibold">Vista general de los cursos</p>
      </div>
      <div className="w-full h-[90%] bg-white shadow-xl px-3 py-5  grid grid-cols-2gap-3   rounded-md">
      {session.user.organizations.map((org) => (
        <button key={org.orgId} onClick={() => handleSelectOrg(org.orgId, org.role)}>
          {org.orgName} ({org.role})
        </button>
      ))}
      </div>

    </div>
  );
}

export default organizationSelect;
