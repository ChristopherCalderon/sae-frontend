"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, startTransition, useEffect } from "react";

function OrganizationSelect() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [pendingOrg, setPendingOrg] = useState(null);
  const [localSession, setLocalSession] = useState(session); // Copia local

  // Sincroniza la sesión local cuando cambia
  useEffect(() => {
    setLocalSession(session);
  }, [session]);

  const handleSelectOrg = async (orgName, orgRole) => {
    setPendingOrg(orgName);
    
    try {
      // Actualización optimista
      setLocalSession(prev => ({
        ...prev,
        user: {
          ...prev?.user,
          activeRole: orgRole,
          selectedOrg: orgName
        }
      }));

      const result = await update({
        activeRole: orgRole,
        selectedOrg: orgName
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

  if (!localSession?.user?.organizations) {
    return <div>Cargando organizaciones...</div>;
  }

  return (
    <div className="bg-background h-screen flex flex-col gap-5 w-full p-8 overflow-clip">
      <div className="w-full text-primary">
        <h1 className="text-2xl font-bold">Mis Clases</h1>
        <p className="font-semibold">Vista general de los cursos</p>
      </div>
      <div className="w-full h-[90%] bg-white shadow-xl px-3 py-5 grid grid-cols-2 gap-3 rounded-md">
        {localSession.user.organizations.map((org) => (
          <button
            key={org.orgId}
            type="button"
            onClick={() => handleSelectOrg(org.orgName, org.role)}
            className={`p-4 border rounded-lg transition-colors ${
              pendingOrg === org.orgName 
                ? "bg-gray-100 cursor-wait" 
                : "hover:bg-gray-50"
            }`}
            disabled={pendingOrg === org.orgName}
          >
            {org.orgName} ({org.role})
            {pendingOrg === org.orgName && "..."}
          </button>
        ))}
      </div>
    </div>
  );
}

export default OrganizationSelect;