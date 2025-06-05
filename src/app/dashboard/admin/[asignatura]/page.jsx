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
import { CiLock } from "react-icons/ci";
import { FaTimes, FaRegQuestionCircle, FaRegCheckCircle } from "react-icons/fa";
import { PiOpenAiLogoLight } from "react-icons/pi";
import { GiSpermWhale } from "react-icons/gi";
import { RiGeminiLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

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
  const [showSuccessModal, setShowSuccessModal] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);

  const eliminarModelo = (index) => {
    const nuevosModelos = modelos.filter((_, i) => i !== index);
    setModelos(nuevosModelos);
  };

  const addOrgModel = async (model) => {
    setShowAssignModal(false);
    try {
      setLoading(true);
      await patchTeacherModels(model, email, session.user.selectedOrgId);
      getData(session.user.selectedOrgId);

      setShowSuccessModal("Administrar modelos");
      setTimeout(() => {
        setShowSuccessModal("");
      }, 2000);
      
    } catch (error) {
      console.log(error);
    }
  };

  const selectModelo = (id) => {
    setShowConfirmModal(true);
    setModeloSeleccionado(id);
  };

  const handleModelAssign = (id) => {
    setShowAssignModal(true);
    setModeloSeleccionado(id);
  }


  const deleteModel = async (model) => {
    setShowConfirmModal(false);
    try {
      setLoading(true);
      await deleteAsignedModel(model, email, session.user.selectedOrgId);
      getData(session.user.selectedOrgId);
      setShowSuccessModal("Modelo de IA");
      setTimeout(() => {
        setShowSuccessModal("");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const getProviderIcon = (name) => {
    switch (name.toLowerCase()) {
      case "openai":
        return (
          <PiOpenAiLogoLight className="text-secondary h-[32px] w-[32px] md:h-[40px] md:w-[40px]" />
        );
      case "deepseek":
        return (
          <GiSpermWhale className="text-secondary h-[32px] w-[32px] md:h-[40px] md:w-[40px]" />
        );
      case "gemini":
        return (
          <RiGeminiLine className="text-secondary h-[32px] w-[32px] md:h-[40px] md:w-[40px]" />
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
    <div className="bg-background flex flex-col w-full h-full px-1 py-8 md:p-10 ">
      <div className="w-full flex flex-col items-center text-primary px-4">
        <h1
          className="font-[Bitter] font-semibold text-[20px] leading-[24px] text-center md:text-[26px] md:leading-[30px] 
          lg:text-[32px] lg:leading-[32px] max-w-[700px]"
        >
          {name || "@UserGitHub"}
        </h1>
        <p
          className="font-[Bitter] font-light text-[11px] leading-[13px] text-center text-gray-500 mt-2 md:text-[16px] md:leading-[18px] 
          lg:text-[20px] lg:leading-[20px] max-w-[700px]"
        >
          Asigna un modelo de IA a {name || "@UserGitHub"}
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
                      className="w-full max-w-[550px] bg-white rounded-[5px] shadow px-[10px] py-[10px] flex justify-between items-center"
                    >
                      {/* Contenedor ícono + texto */}
                      <div className="flex items-center gap-4 w-full overflow-hidden">
                        <div className="shrink-0 text-[30px] md:text-[36px] flex items-center justify-center">
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
                        onClick={() => handleModelAssign(modelo._id)}
                        className="text-primary hover:text-secondary text-xl md:text-3xl"
                      >
                        <FaPlus />
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

              <div className="w-full md:max-w-[500px] mx-auto space-y-2 ">
                {modelos.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No hay modelos asignados.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4 items-center justify-center w-full">
                    {modelos.map((modelo, index) => (
                      <div
                        key={index}
                        className="w-full max-w-[550px] bg-white rounded-[5px] shadow px-[10px] py-[10px] flex justify-between items-center"
                      >
                        {/* Contenedor ícono + texto */}
                        <div className="flex items-center gap-4 w-full overflow-hidden">
                          <div className="shrink-0 text-[30px] md:text-[36px] flex items-center justify-center">
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
                            onClick={() => selectModelo(modelo._id)}
                            className="text-primary hover:text-red-800 text-xl md:text-3xl"
                          >
                            <FaTimes />
                          </button>
                        ) : (
                          <Tippy
                            content="Es un Modelo Personal, no se puede eliminar"
                            trigger="mouseenter focus click"
                            touch={["hold", 0]}
                          >
                            <button className="text-primary text-xl md:text-3xl">
                              <CiLock />
                            </button>
                          </Tippy>
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

      {/* Modal de confirmacion-------------------------- */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-white w-full lg:w-1/4 flex flex-col gap-1 justify-center items-center p-6 rounded  text-center shadow-[0px_8px_8px_rgba(0,0,0,0.25)]">
            <FaRegQuestionCircle className="text-5xl" />
            <h1 className="text-2xl text-primary font-bold">Modelo de IA</h1>
            <p className="text-primary text-lg font-medium mb-2">
              ¿Está seguro de eliminar el modelo de IA?
            </p>
            <div className="w-full flex gap-2 justify-center items-center">
              <button
                className="flex w-1/3 lg:w-1/3   items-center justify-center gap-2 font-semibold bg-white border-2 border-secondary text-secondary hover:text-white px-5 hover:bg-secondary py-1 rounded shadow-lg"
                onClick={() => deleteModel(modeloSeleccionado)}
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
      {/* Modal de exito-------------------------- */}
      {showSuccessModal != "" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-white w-full lg:w-1/4 flex flex-col gap-1 justify-center items-center p-6 rounded  text-center shadow-[0px_8px_8px_rgba(0,0,0,0.25)]">
            <FaRegCheckCircle className="text-5xl" />
            <h1 className="text-2xl text-primary font-bold">
              {showSuccessModal}
            </h1>
            <p className="text-primary text-lg font-medium mb-2">
              ¡Accion realizada con exito!
            </p>
          </div>
        </div>
      )}
      {/* Modal de asignar modelo */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-white w-full lg:w-1/4 flex flex-col gap-1 justify-center items-center p-6 rounded  text-center shadow-[0px_8px_8px_rgba(0,0,0,0.25)]">
            <FaRegQuestionCircle className="text-5xl" />
            <h1 className="text-2xl text-primary font-bold">Administrar modelos</h1>
            <p className="text-primary text-lg font-medium mb-2">
              ¿Está seguro de asignar este modelo  al usuario {name}?
            </p>
            <div className="w-full flex gap-2 justify-center items-center">
              <button
                className="flex w-1/3 lg:w-1/3   items-center justify-center gap-2 font-semibold bg-white border-2 border-secondary text-secondary hover:text-white px-5 hover:bg-secondary py-1 rounded shadow-lg"
                onClick={() => addOrgModel(modeloSeleccionado)}
              >
                Si
              </button>
              <button
                className="flex w-1/3 lg:w-1/3   items-center justify-center gap-2 font-semibold bg-white border-2 border-secondary text-secondary hover:text-white px-5 hover:bg-secondary py-1 rounded shadow-lg"
                onClick={() => setShowAssignModal(false)}
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

export default SubjectPage;
