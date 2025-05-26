"use client";
import ModeloCard from "@/components/Models/ModelCard";
import { PiOpenAiLogoLight } from "react-icons/pi";
import { GiSpermWhale } from "react-icons/gi";
import { RiGeminiLine, RiErrorWarningLine } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import { FaTimes, FaRegQuestionCircle, FaRegCheckCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import {
  createOrgModel,
  deleteOrgModel,
  getModelProviders,
  getOrgModels,
} from "@/services/githubService";
import Loading from "@/components/loader/Loading";
import { useSession } from "next-auth/react";

function ModelsPage() {
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proveedor, setProveedor] = useState("");
  const [nuevoModelo, setNuevoModelo] = useState("");
  const [nombreLlave, setNombreLlave] = useState("");
  const [llave, setLlave] = useState("");
  const [providerArray, setProviderArray] = useState();
  const { data: session, status } = useSession();
  const [tab, setTab] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEmptyData, setShowEmptyData] = useState(false);
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);

  const getData = async (id) => {
    try {
      setLoading(true);
      const responseProviders = await getModelProviders();
      if (responseProviders) {
        setProviderArray(responseProviders);
      }
      const responseModels = await getOrgModels(id);
      if (responseModels) {
        console.log(responseModels);
        setModelos(responseModels);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const selectModelo = (id) => {
    setShowConfirmModal(true);
    setModeloSeleccionado(id);
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

  const emptyData = () => {
    return (
      proveedor.trim() === "" ||
      nuevoModelo.trim() === "" ||
      nombreLlave.trim() === "" ||
      llave.trim() === ""
    );
  };

  const addModel = async () => {
    if (emptyData()) {
      // Verificar si los campos están vacíos
      setShowEmptyData(true);
      setTimeout(() => {
        setShowEmptyData(false);
      }, 2000);
      return;
    }
    try {
      await createOrgModel(
        proveedor,
        nuevoModelo,
        nombreLlave,
        llave,
        session.user.selectedOrgId
      );
      setProveedor("");
      setNuevoModelo("");
      setNombreLlave("");
      setLlave("");

      setShowSuccessModal("Modelo de IA agregado");
      setTimeout(() => {
        setShowSuccessModal("");
      }, 2000);

      getData(session.user.selectedOrgId);
    } catch (error) {}
  };

  const deleteModel = async (id) => {
    setShowConfirmModal(false);
    try {
      await deleteOrgModel(id);
      getData(session.user.selectedOrgId);
      setShowSuccessModal("Modelo de IA");
      setTimeout(() => {
        setShowSuccessModal("");
      }, 2000);
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
          Gestión de modelos de IA de la organización
        </h1>
        <p
          className="font-[Bitter] font-light text-[11px] leading-[13px] text-center text-gray-500 mt-2 md:text-[16px] md:leading-[18px] 
          lg:text-[20px] lg:leading-[20px] max-w-[700px]"
        >
          Agregar o elimina modelos de IA para la Organización
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
          <span>Agregar Modelo</span>
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
          <span>Modelos</span>
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
            {/* Agregar Modelo (Izquierda en desktop) */}
            <div
              className={`${
                tab === 1 ? "flex" : "hidden"
              } lg:flex font-mono text-primary space-y-4 flex-col items-center w-full md:max-w-[600px] mx-auto`}
            >
              <h2 className="hidden lg:block text-[18px] md:text-[22px] font-bold text-secondary pb-1 border-b-2 border-secondary w-fit mb-4 ml-4">
                Agregar Modelo
              </h2>
              <div className="w-full md:max-w-[500px] mx-auto">
                <label className="text-[14px] font-bold md:text-[20px]">
                  Proveedor
                </label>
                <div className="relative mt-2">
                  <select
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
                    className="w-full appearance-none h-[32px] p-[10px] text-[10px] leading-[12px] rounded-[5px] bg-white
                     md:h-[51px] md:max-w-[600px] md:p-[16px] md:text-[15px] lg:h-[70px] lg:text-[18px]"
                  >
                    <option value="">Seleccionar proveedor</option>
                    {providerArray.map((provider) => (
                      <option key={provider._id} value={provider._id}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                  <IoIosArrowDown className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-lg text-secondary" />
                </div>
              </div>

              <div className="w-full md:max-w-[500px] mx-auto">
                <label className="text-[14px] font-bold md:text-[20px]">
                  Modelo
                </label>
                <input
                  type="text"
                  value={nuevoModelo}
                  placeholder="Ej: gpt-3.5-turbo"
                  onChange={(e) => setNuevoModelo(e.target.value)}
                  className="w-full h-[32px] p-[10px] rounded-[5px] text-[11px] bg-white
                  md:h-[51px] md:p-[16px] md:text-[15px] lg:h-[70px] lg:text-[18px]"
                />
              </div>

              <div className="w-full md:max-w-[500px] mx-auto">
                <label className="text-[14px] font-bold md:text-[20px]">
                  Nombre de la clave
                </label>
                <input
                  type="text"
                  value={nombreLlave}
                  placeholder="Ej: Llave principal"
                  onChange={(e) => setNombreLlave(e.target.value)}
                  className="w-full h-[32px] p-[10px] rounded-[5px] text-[11px] bg-white
                  md:h-[51px] md:p-[16px] md:text-[15px] lg:h-[70px] lg:text-[18px]"
                />
              </div>

              <div className="w-full md:max-w-[500px] mx-auto">
                <label className="text-[14px] font-bold md:text-[20px]">
                  Clave
                </label>
                <input
                  type="text"
                  value={llave}
                  onChange={(e) => setLlave(e.target.value)}
                  placeholder="Ej: sk-abc123xyz..."
                  className="w-full h-[32px] p-[10px] rounded-[5px] text-[11px] bg-white
                  md:h-[51px] md:p-[15px] md:text-[16px] lg:h-[70px] lg:text-[18px]"
                />
              </div>

              <div className="w-full max-w-[271px] md:max-w-[647px] mx-auto flex justify-center gap-[13px] md:gap-[22px] mt-[10px]">
                <button
                  onClick={() => router.back()}
                  className="w-[80px] h-[36px] md:w-[200px] md:h-[42px] p-[10px] border-[2px] border-secondary text-secondary rounded-[5px] text-[14px] font-[Bitter] font-semibold bg-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => addModel()}
                  className="w-[80px] h-[36px] md:w-[200px] md:h-[42px] p-[10px] bg-secondary text-white rounded-[5px] text-[14px] font-[Bitter] font-semibold"
                >
                  Agregar
                </button>
              </div>
            </div>

            {/* Sección para mostrar los modelos*/}
            <div
              className={`${
                tab === 2 ? "block" : "hidden"
              } lg:block font-mono text-primary space-y-6 `}
            >
              <h2 className="hidden lg:block text-[18px] md:text-[22px] font-bold text-secondary pb-1 border-b-2 border-secondary w-fit mb-4 ml-4">
                Modelos
              </h2>
              <div className="w-full md:max-w-[500px] mx-auto space-y-2 lg:mt-14">
                {modelos.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No hay modelos asignados.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4 items-center justify-center w-full">
                    {modelos.map((modelo) => (
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

                        {/* Botón eliminar */}
                        <button
                          onClick={() => selectModelo(modelo._id)}
                          className="text-primary hover:text-red-800 text-xl md:text-3xl"
                        >
                          <FaTimes />
                        </button>
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

      {/* Modal de datos vacios*/}
      {showEmptyData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-white w-full lg:w-1/4 flex flex-col gap-1 justify-center items-center p-6 rounded  text-center shadow-[0px_8px_8px_rgba(0,0,0,0.25)]">
            <RiErrorWarningLine className="text-5xl" />
            <h1 className="text-2xl text-primary font-bold">Campos vacios</h1>
            <p className="text-primary text-lg font-medium mb-2">
              Por favor, complete todos los campos requeridos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModelsPage;
