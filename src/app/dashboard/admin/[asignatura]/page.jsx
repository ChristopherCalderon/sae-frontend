"use client";

import Loading from "@/components/loader/Loading";
import {
  deleteAsignedModel,
  getOrgModels,
  getTeacherModels,
  patchTeacherModels,
} from "@/services/githubService";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ImCancelCircle, ImLock } from "react-icons/im";
import { PiOpenAiLogoLight } from "react-icons/pi";
import { GiSpermWhale } from "react-icons/gi";
import { RiGeminiLine } from "react-icons/ri";
import { IoMdAddCircleOutline } from "react-icons/io";

function SubjectPage() {
  const searchParams = useSearchParams();
  const encodedData = searchParams.get("data");
  const { email, name } = JSON.parse(atob(encodedData));
  const [modelos, setModelos] = useState([]);
  const [orgmodels, setOrgModels] = useState([]);
  const [proveedor, setProveedor] = useState("");
  const [nuevoModelo, setNuevoModelo] = useState("");
  const [nombreLlave, setNombreLlave] = useState("");
  const [loading, setLoading] = useState(true);
  const [llave, setLlave] = useState("");
  const { data: session, status } = useSession();
  const [tab, setTab] = useState(1);

  const eliminarModelo = (index) => {
    const nuevosModelos = modelos.filter((_, i) => i !== index);
    setModelos(nuevosModelos);
  };

  const addOrgModel = async (model) => {
    try {
      setLoading(true);
      await patchTeacherModels(model, email, session.user.selectedOrgId);
      getData(session.user.selectedOrgId);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteModel = async (model) => {
    try {
      setLoading(true);
      await deleteAsignedModel(model, email, session.user.selectedOrgId);
      getData(session.user.selectedOrgId);
    } catch (error) {
      console.log(error);
    }
  };

  const getProviderIcon = (name) => {
    switch (name.toLowerCase()) {
      case "openai":
        return (
          <PiOpenAiLogoLight className="text-secondary h-[32px] w-[32px] md:h-[56px] md:w-[56px]" />
        );
      case "deepseek":
        return (
          <GiSpermWhale className="text-secondary h-[32px] w-[32px] md:h-[56px] md:w-[56px]" />
        );
      case "gemini":
        return (
          <RiGeminiLine className="text-secondary h-[32px] w-[32px] md:h-[56px] md:w-[56px]" />
        );
      default:
        return <div className="w-5 h-5" />;
    }
  };

  const getData = async (orgId) => {
    try {
      setLoading(true);
      const res = await getTeacherModels(email, orgId);
      const responseModels = await getOrgModels(orgId);
      if (responseModels && res) {
        console.log(responseModels);
        setOrgModels(responseModels);
        console.log(res.models);
        setModelos(res.models);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      getData(session.user.selectedOrgId);
    } else if (status === "loading") {
      // Sesión aún cargando
      setLoading(true);
    }
  }, [status]);

  return (
    <div className="bg-background flex flex-col w-full h-full p-5 py-8 md:p-10 ">
      <div className="w-full flex flex-col items-center text-primary px-4">
        <h1
          className="font-[Bitter] font-semibold text-[20px] leading-[24px] text-center md:text-[26px] md:leading-[30px] 
          lg:text-[32px] lg:leading-[32px] max-w-[700px]"
        >
          USUARIO
        </h1>
        <p
          className="font-[Bitter] font-light text-[11px] leading-[13px] text-center text-gray-500 mt-2 md:text-[16px] md:leading-[18px] 
          lg:text-[20px] lg:leading-[20px] max-w-[700px]"
        >
          Asigna un modelo de IA a USUARIO
        </p>
      </div>

      {/* Tabs solo en mobile/tablet */}
      <div className="flex justify-center mt-4 border-b border-gray-300 w-full max-w-[280px] md:max-w-[600px] mx-auto lg:hidden">
        <button
          onClick={() => setTab(1)}
          className={`flex flex-col items-center justify-center flex-1 text-center py-2 font-bold text-[14px] md:text-[18px] relative ${
            tab === 1 ? "text-secondary" : "text-black"
          }`}
        >
          <span>Asignar Modelo</span>
          {tab === 1 && (
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-secondary" />
          )}
        </button>

        <button
          onClick={() => setTab(2)}
          className={`flex flex-col items-center justify-center flex-1 text-center py-2 font-bold text-[14px] md:text-[18px] relative ${
            tab === 2 ? "text-secondary" : "text-black"
          }`}
        >
          <span>Modelos Actuales</span>
          {tab === 2 && (
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-secondary" />
          )}
        </button>
      </div>

      <div className="w-full h-full p-4 md:p-6 lg:p-8">
        {loading ? (
          <Loading />
        ) : (
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
            <div className="hidden lg:block absolute left-1/2 top-0 h-full border-l-[1.5px] border-gray-300 transform -translate-x-1/2" />
            {/* Asignar Modelo (Izquierda en desktop) */}
            <div
              className={`${
                tab === 1 ? "flex" : "hidden"
              } lg:flex font-mono text-primary space-y-4 flex-col items-center w-full md:max-w-[600px] mx-auto`}
            >
              <h2 className="hidden lg:block text-[18px] md:text-[22px] font-bold text-secondary pb-1 border-b-2 border-secondary w-fit mb-4 ml-4">
                Asignar Modelo
              </h2>

              <div className="flex flex-col gap-4 items-center justify-center w-full">
                {orgmodels
                  .filter(
                    (modelo) => !modelos.some((m) => m._id === modelo._id)
                  )
                  .map((modelo) => (
                    <div
                      key={modelo._id}
                      className="w-full max-w-[550px] bg-white rounded-[5px] shadow px-[10px] py-[10px] flex justify-between items-start"
                    >
                      {/* Contenedor ícono + texto */}
                      <div className="flex items-start gap-3 w-full overflow-hidden">
                        <div className="shrink-0">
                          {getProviderIcon(modelo.modelType.name)}
                        </div>

                        <div className="flex flex-col text-sm leading-[14px] md:text-[20px] md:leading-[24px] w-full break-words">
                          <span className="font-bold text-primary break-words">
                            {modelo.name}
                          </span>
                          <span className="text-primary text-[10px] md:text-[16px] break-words">
                            {modelo.version}
                          </span>
                        </div>
                      </div>
                      {/* Botón asignar */}
                      <button
                        onClick={() => addOrgModel(modelo._id)}
                        className="text-primary hover:text-secondary text-lg"
                      >
                        <IoMdAddCircleOutline />
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Sección para mostrar los modelos actuales*/}
            <div
              className={`${
                tab === 2 ? "block" : "hidden"
              } lg:block font-mono text-primary space-y-6 `}
            >
              <h2 className="hidden lg:block text-[18px] md:text-[22px] font-bold text-secondary pb-1 border-b-2 border-secondary w-fit mb-4 ml-4">
                Modelos Actuales
              </h2>

              <div className="ml-4 md:ml-10 space-y-2">
                {modelos.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No hay modelos asignados.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4 items-center justify-center w-full">
                    {modelos.map((modelo, index) => (
                      <div
                        key={index}
                        className="w-full max-w-[550px] bg-white rounded-[5px] shadow px-[10px] py-[10px] flex justify-between items-start"
                      >
                        {/* Contenedor ícono + texto */}
                        <div className="flex items-start gap-3 w-full overflow-hidden">
                          <div className="shrink-0">
                            {getProviderIcon(modelo.modelType.name)}
                          </div>

                          <div className="flex flex-col text-sm leading-[14px] md:text-[20px] md:leading-[24px] w-full break-words">
                            <span className="font-bold text-primary break-words">
                              {modelo.name}
                            </span>
                            <span className="text-primary text-[10px] md:text-[16px] break-words">
                              {modelo.version}
                            </span>
                          </div>
                        </div>

                        {modelo.orgId ? (
                          <button
                            onClick={() => deleteModel(modelo._id)}
                            className="text-primary hover:text-red-800 text-lg"
                          >
                            <ImCancelCircle />
                          </button>
                        ) : (
                          <button className="text-primary text-lg">
                            <ImLock />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubjectPage;
