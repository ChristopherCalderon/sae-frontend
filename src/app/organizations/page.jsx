"use client";
import OrganizationCard from "@/components/cards/OrganizationCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, startTransition, useEffect } from "react";



function OrganizationSelect() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [pendingOrg, setPendingOrg] = useState(null);
  const [localSession, setLocalSession] = useState(session); // Copia local de la sesion para acatualizar ui

  useEffect(() => {
    setLocalSession(session);
  }, [session]);

  const handleSelectOrg = async (orgName,orgId, orgRole) => {
    setPendingOrg(orgName);

    try {
      // Actualización optimista
      setLocalSession((prev) => ({
        ...prev,
        user: {
          ...prev?.user,
          activeRole: orgRole,
          selectedOrg: orgName,
          selectedOrgId: orgId,
        },
      }));

      const result = await update({
        activeRole: orgRole,
        selectedOrg: orgName,
        selectedOrgId: orgId,
      });

      startTransition(() => {
        router.push("/dashboard/clases");
      });
    } catch (error) {
      setPendingOrg(null);
      // Revertir en caso de error
      setLocalSession(session);
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-background h-screen flex flex-col gap-5 w-full p-8 overflow-clip">
      <div className="w-full text-primary">
        <h1 className="text-2xl font-bold">Mis Organizaciones</h1>
        <p className="font-semibold">Selecciona una organizacion para acceder</p>
      </div>
      <div className="w-full h-[90%] bg-white shadow-xl px-3 py-5 grid grid-cols-3 gap-3 rounded-md">
        {!localSession?.user?.organizations ? (
          <p>Cargando organizaciones...</p>
        ) :  pendingOrg ? <p>Redirigiendo...</p> 
        :
        localSession.user.organizations.length === 0 ? (
          <p>No se encontraron organizaciones</p>
        ) : (
          localSession.user.organizations.map((org) => (org.role !== 'Student' && org.isActive &&
            <OrganizationCard
              key={org.orgId}
              pendingOrg={pendingOrg}
              handleSelected={handleSelectOrg}
              org={org}
            ></OrganizationCard>
          ))
        )}
      </div>
    </div>
  );
}

export default OrganizationSelect;
