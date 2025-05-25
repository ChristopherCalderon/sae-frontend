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

  const eliminarModelo = (index) => {
    const nuevosModelos = modelos.filter((_, i) => i !== index);
    setModelos(nuevosModelos);
  };

  const agregarModelo = () => {
    if (nuevoModelo.trim() === "") return;
    const nombreCompleto = proveedor
      ? `${proveedor} - ${nuevoModelo}`
      : nuevoModelo;
    setModelos([...modelos, nombreCompleto]);
    setProveedor("");
    setNuevoModelo("");
    setNombreLlave("");
    setLlave("");
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
    <div className="bg-background flex flex-col gap-5 w-full h-full p-4 md:p-6 lg:p-8">
      <div className="w-full text-primary font-mono">
        <h1 className="text-2xl font-bold">Nombre de catedratico</h1>
        <p>Asigna modelos de IA por secciones</p>
      </div>

      <div className="w-full h-full bg-white shadow-xl p-4 md:p-6 lg:p-8 rounded-md">
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 h-full">
            <div className="font-mono text-primary space-y-6 lg:border-r-2 border-gray-300 lg:pr-10">
              <h2 className="text-center text-xl font-bold">
                Modelos actuales
              </h2>

              <div>
                <div className="ml-4 md:ml-10 space-y-2">
                  {modelos.length === 0 ? (
                    <p className="text-gray-500 italic">
                      No hay modelos asignados.
                    </p>
                  ) : (
                    modelos.map((modelo, index) => (
                      <div
                        key={index}
                        className="bg-blue-100 px-4 py-2 max-w-full mr-10 rounded shadow-md flex justify-between items-center"
                      >
                        {modelo.modelType.name} - {modelo.version} |{" "}
                        {modelo.name}
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
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="font-mono text-primary space-y-4 flex flex-col h-full items-center overflow-y-clip">
              <h2 className="text-xl font-bold">Agregar modelo</h2>
              <div className="w-full flex flex-col gap-2 px-10 h-[80%] max-h-[80%]overflow-y-scroll ">
                {orgmodels
                  .filter(
                    (modelo) => !modelos.some((m) => m._id === modelo._id)
                  )
                  .map((modelo) => (
                    <div
                      key={modelo._id}
                      className="bg-blue-100 px-4 py-2 w-full rounded shadow-md flex justify-between items-center"
                    >
                      <span>
                        {modelo.modelType.name} - {modelo.version} |{" "}
                        {modelo.name}
                      </span>
                      <button
                        onClick={() => addOrgModel(modelo._id)}
                        className="text-primary hover:text-accent text-lg"
                      >
                        <IoMdAddCircleOutline />
                      </button>
                    </div>
                  ))}
              </div>
              {/* <div className="w-full">
              <div className="w-full max-w-sm">
                <label className="font-bold">Proveedor</label>
                <div className="relative mt-2">
                  <select
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
                    className="w-full px-3 py-2 bg-background rounded appearance-none focus:outline-none shadow-md"
                  >
                    <option value="">Seleccionar proveedor</option>
                    <option value="OpenIA">OpenIA</option>
                    <option value="Deepseek">Deepseek</option>
                    <option value="Gemini">Gemini</option>
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
              </div>
   */}

              <div className="pt-4">
                <button
                  onClick={agregarModelo}
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

export default SubjectPage;
