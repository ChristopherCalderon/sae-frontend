"use client";
import ModeloCard from "@/components/Models/ModelCard";
import { PiOpenAiLogoLight } from "react-icons/pi";
import { GiSpermWhale } from "react-icons/gi";
import { RiGeminiLine } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import { ImCancelCircle } from "react-icons/im";
import { IoIosArrowDown } from "react-icons/io";
import { createOrgModel, deleteOrgModel, getModelProviders, getOrgModels } from "@/services/githubService";
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
  const { data: session, status } = useSession(); // Obtenemos el status

  const eliminarModelo = (index) => {
    const nuevosModelos = modelos.filter((_, i) => i !== index);
    setModelos(nuevosModelos);
  };


  const getData = async (id) => {
    try {
      setLoading(true);
      const responseProviders = await getModelProviders();
      if (responseProviders) {
        setProviderArray(responseProviders);
      }      
      const responseModels = await getOrgModels(id);
      if (responseModels) {
        console.log(responseModels)
        setModelos(responseModels);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const addModel = async () => {
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

      getData(session.user.selectedOrgId)
    } catch (error) {}
  };

  const deleteModel = async(id) => {
    try {
      await deleteOrgModel(id)
      getData(session.user.selectedOrgId)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (status === "authenticated" ) {
    
      getData(session.user.selectedOrgId)
    } else if (status === "loading") {
      // Sesión aún cargando
      setLoading(true);
    }
  }, [status]);

  return (
    <div className="bg-background flex flex-col gap-5 w-full h-full p-4 md:p-6 lg:p-8">
      <div className="w-full text-primary font-mono">
        <h1 className="text-2xl font-bold">Nombre de asignatura</h1>
        <p>Asigna modelos de IA por secciones</p>
      </div>

      <div className="w-full h-full bg-white shadow-xl p-4 md:p-6 lg:p-8 rounded-md">
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 h-full">
            <div className="font-mono text-primary space-y-6 lg:border-r-2 border-gray-300 lg:pr-20">
              <div>
                <p className="text-xl font-bold text-center mb-2">Modelos</p>
                <div className="ml-4 md:ml-10 space-y-2">
                  {modelos.length === 0 ? (
                    <p className="text-gray-500 italic">
                      No hay modelos asignados.
                    </p>
                  ) : (
                    modelos.map((modelo, index) => (
                      <div
                        key={modelo._id}
                        className="bg-blue-100 px-4 py-2 w-full rounded shadow-md flex justify-between items-center"
                      >
                        <span>{modelo.modelType.name} - {modelo.version} | {modelo.name}</span>
                        <button
                          onClick={() => deleteModel(modelo._id)}
                          className="text-primary hover:text-red-800 text-lg"
                        >
                          <ImCancelCircle />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="font-mono text-primary space-y-4 flex flex-col items-center">
              <h2 className="text-xl font-bold mt-1">Agregar modelo</h2>

              <div className="w-full max-w-sm">
                <label className="font-bold">Proveedor</label>
                <div className="relative mt-2">
                  <select
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
                    className="w-full px-3 py-2 bg-background rounded appearance-none focus:outline-none shadow-md"
                  >
                    <option value="">Seleccionar proveedor</option>
                    {providerArray.map((provider) => (
                      <option key={provider._id} value={provider._id}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                  <IoIosArrowDown className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-lg text-gray-600" />
                </div>
              </div>

              <div className="w-full max-w-sm">
                <label className="font-bold">Modelo:</label>
                <input
                  type="text"
                  value={nuevoModelo}
                  onChange={(e) => setNuevoModelo(e.target.value)}
                  className="w-full mt-2 px-3 py-2 rounded-md bg-background shadow-md focus:outline-none"
                />
              </div>

              <div className="w-full max-w-sm">
                <label className="font-bold">Nombre de la llave:</label>
                <input
                  type="text"
                  value={nombreLlave}
                  onChange={(e) => setNombreLlave(e.target.value)}
                  className="w-full mt-2 px-3 py-2 rounded-md bg-background shadow-md focus:outline-none"
                />
              </div>

              <div className="w-full max-w-sm">
                <label className="font-bold">Llave:</label>
                <input
                  type="text"
                  value={llave}
                  onChange={(e) => setLlave(e.target.value)}
                  className="w-full mt-2 px-3 py-2 rounded-md bg-background shadow-md focus:outline-none"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={() => addModel()}
                  className="w-40 md:w-48 mx-auto bg-primary text-white font-bold py-2 rounded shadow hover:bg-primary-hover"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModelsPage;
