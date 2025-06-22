"use client";
import OrganizationCard from "@/components/cards/OrganizationCard";
import Loading from "@/components/loader/Loading";
import { decodeToken } from "@/services/ltiService";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, startTransition, useEffect } from "react";
import {
  FaCheckCircle,
  FaRegCheckSquare,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";

function OrganizationSelect() {
  const { data: session, update } = useSession(); //Obtiene sesion y estado
  const [localSession, setLocalSession] = useState(session); // Copia local de la sesion para acatualizar ui
  const router = useRouter();
  const [pendingOrg, setPendingOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ltiData, setLtiData] = useState("Teacher");
  const [returnUrl, setReturnUrl] = useState('');

  //Guarda la session cada vez que se actualiza
  useEffect(() => {
    setLocalSession(session);
  }, [session]);

  const getData = async () => {
    try {
      setLoading(true);

      // 1. Obtener el token de sessionStorage
      const token = sessionStorage.getItem("jwtToken");

      if (token) {
        // 2. Decodificar el token para obtener información del curso
        const decodedData = await decodeToken(token);

        console.log("Datos decodificados:", decodedData);
        console.log(decodedData.role);
        setReturnUrl(decodedData.url_return)
        setLtiData(decodedData.role);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

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

    //Funcion para actualizar organizacion seleccionada
  const handleResetOrg = async (orgName, orgId, orgRole) => {
    setPendingOrg(orgName);

    try {
      // Actualización optimista
      setLocalSession((prev) => ({
        ...prev,
        user: {
          ...prev?.user,
          activeRole: 'guest',
          selectedOrg: null,
          selectedOrgId: null,
        },
      }));

      const result = await update({
          activeRole: 'guest',
          selectedOrg: null,
          selectedOrgId: null,
      });

    } catch (error) {
      setPendingOrg(null);
      // Revertir en caso de error
      setLocalSession(session);
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    handleResetOrg();
    getData();

  }, []);

  return (
    <div className="bg-background font-primary font-bold h-screen flex flex-col gap-5 w-full p-5 py-8 overflow-clip">
      <div className="w-full flex  flex-col md:flex-row items-center justify-between gap-2 text-primary">
        {ltiData == "Student" ? (
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-center md:text-left">
              Estudiante registrado
            </h1>
          </div>
        ) : (
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-center md:text-left">
              Mis Organizaciones
            </h1>
            <p className="font-light text-center text-sm md:text-left">
              Selecciona una organizacion para acceder
            </p>
          </div>
        )}

        <div
          onClick={() => {
            signOut({ callbackUrl: "/" });
          }}
          className="flex justify-center text-center items-center gap-2 text-sm cursor-pointer text-white px-8 py-1 lg:py-2  bg-secondary hover:bg-primary-hover rounded-xl font-semibold"
        >
          <span className="">Cerrar sesion</span>
          <FaSignOutAlt className="text-2xl" />
        </div>
      </div>
      {!localSession?.user?.organizations || loading ? (
        <Loading message={"Cargando..."} />
      ) : pendingOrg ? (
        <Loading message={"Redirigiendo..."} />
      ) : ltiData == "Student" ? (
        <div className="flex flex-col w-full h-full justify-center items-center text-center gap-2 ">
          <FaRegCheckSquare className="text-8xl text-secondary" />
          <p className="text-xl">Te has registrado exitosamente</p>
          <p className="font-normal">
            Ingresa nuevamente a la tarea desde tu plataforma para obtener tu
            repositorio
          </p>
            <p className="w-full text-center">
              <a
                href={returnUrl}
                className="underline w-full hover:font-bold text-[#2768F5]  break-words whitespace-normal"
              >
                {returnUrl}
              </a>
            </p>
        </div>
      ) : localSession.user.organizations.length === 0 &&
        ltiData == "Teacher" ? (
        <div className="flex flex-col w-full h-full justify-center items-center ">
          <FaSearch className="text-8xl text-secondary" />
          <p>No se han encontrado Organizaciones</p>
        </div>
      ) : (
        <div
          className="w-full max-h-[90%] py-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 overflow-y-scroll  rounded-md
      [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-background
        [&::-webkit-scrollbar-thumb]:bg-primary`"
        >
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
