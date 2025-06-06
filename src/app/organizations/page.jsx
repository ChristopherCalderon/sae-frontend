"use client";
import OrganizationCard from "@/components/cards/OrganizationCard";
import Loading from "@/components/loader/Loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, startTransition, useEffect } from "react";

function OrganizationSelect() {
  const { data: session, update } = useSession(); //Obtiene sesion y estado
  const [localSession, setLocalSession] = useState(session); // Copia local de la sesion para acatualizar ui
  const router = useRouter();
  const [pendingOrg, setPendingOrg] = useState(null);

  //Guarda la session cada vez que se actualiza
  useEffect(() => {
    setLocalSession(session);
  }, [session]);

  //Funcion para actualizar organizacion seleccionada
  const handleSelectOrg = async (orgName, orgId, orgRole) => {
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

      //Redirige al dashboard
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
    <div className="bg-background font-primary font-bold h-screen flex flex-col gap-5 w-full p-5 py-8 overflow-clip">
      <div className="w-full flex flex-col items-center  text-primary">
        <h1 className="text-2xl font-semibold">Mis Organizaciones</h1>
        <p className="font-light text-center text-sm">
          Selecciona una organizacion para acceder
        </p>
      </div>
      {!localSession?.user?.organizations ? (
          <Loading message={'Cargando...'} />
      ) : pendingOrg ? (
        <Loading message={'Redirigiendo...'} />
      ) : localSession.user.organizations.length === 0 ? (
        <div className="flex w-full justify-center items-center ">
          <p>No se encontraron organizaciones</p>
        </div>
      ) : (
        <div className="w-full max-h-[90%] py-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 overflow-y-scroll  rounded-md
      [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-background
        [&::-webkit-scrollbar-thumb]:bg-primary`">
          {localSession.user.organizations.map(
            (org) =>
              org.role !== "Student" &&
              org.isActive && (
                <OrganizationCard
                  key={org.orgId}
                  pendingOrg={pendingOrg}
                  handleSelected={handleSelectOrg}
                  org={org}
                ></OrganizationCard>
              )
          )}
        </div>
      )}
    </div>
  );
}

export default OrganizationSelect;
