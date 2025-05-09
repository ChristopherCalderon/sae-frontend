"use client";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import {
  createTaskConfig,
  getTaskConfig,
  getTeacherModels,
  updateTaskConfig,
} from "@/services/githubService";
import Loading from "@/components/loader/Loading";
import { useSession } from "next-auth/react";

function Configurar() {
  const router = useRouter();
  const pathname = usePathname();
  const [taskId, setTaskId] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [models, setModels] = useState();
  const [first, setFirst] = useState(true);
  const [formData, setFormData] = useState({
    constraints: "",
    extension: "",
    language: "",
    modelIA: "",
    providerNameIA: "",
    studentLevel: "",
    style: "",
    topic: "",
  });

  const { data: session, status } = useSession();

  const getData = async (id, teacherId, org) => {
    setLoading(true);
    try {
      console.log(id);
      const modelsRes = await getTeacherModels(teacherId, org);
      setModels(modelsRes.models);
      const response = await getTaskConfig(id);
      if (response) {
        setFirst(false);
        setFormData(response.data);
        console.log(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const saveData = async () => {
    try {
      if (first) {
        await createTaskConfig(taskId, formData);
      } else {
        await updateTaskConfig(taskId, formData);
      }

      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleModelChange = (e) => {
    const selectedModelName = e.target.value;
    const selectedModel = models.find(
      (model) => model._id === selectedModelName
    );

    if (selectedModel) {
      setFormData((prevData) => ({
        ...prevData,
        modelIA: selectedModel._id,
        providerNameIA: selectedModel.modelType.name,
      }));
    }
  };

  console.log(formData);

  const goToRepositories = () => {
    const parts = pathname.split("/");
    parts.pop(); // elimina "configurar"
    const newPath = parts.join("/");
    router.push(newPath);
  };

  useEffect(() => {
    if (pathname) {
      const partes = pathname.split("/");
      const id = partes[4];
      setTaskId(id);
    }

    if (taskId && status === "authenticated") {
      console.log(taskId);
      getData(taskId, session.user.email, session.user.selectedOrgId);
    }
  }, [pathname, status, taskId]);

  return (
    <div className="bg-background flex flex-col gap-5 w-full h-full p-8 overflow-clip">
      <div className="w-full text-primary flex items-center">
        <div>
          <h1 className="text-2xl font-bold">Tarea de programación</h1>
          <p className="font-semibold">
            Vista general de los repositorios de los alumnos inscritos en el
            curso
          </p>
        </div>
      </div>

      <div className="w-full h-[90%] bg-white shadow-xl px-3 py-1 gap-3 rounded-md overflow-auto flex flex-col justify-center">
        {loading ? (
          <Loading />
        ) : (
          <div className="w-full h-full flex flex-col justify-center">
            {step === 1 && (
              <div className="bg-background rounded-md h-[90%] p-8 flex  items-center justify-center gap-5 text-primary">
                <div className="w-1/2 h-full flex flex-col justify-center gap-1">
                  <p className="font-medium">Lenguaje de programacion</p>
                  <div className="flex gap-2">
                    <input
                      className="w-2/3 mb-4 p-2 shadow-md rounded bg-white"
                      placeholder="Nombre del lenguaje"
                      value={formData.language}
                      onChange={(e) => handleChange(e, "language")}
                    />
                    <input
                      className="w-1/3 mb-4 p-2 shadow-md rounded bg-white"
                      placeholder="Extension"
                      value={formData.extension}
                      onChange={(e) => handleChange(e, "extension")}
                    />
                  </div>

                  <p className="font-medium">Nivel de estudiante</p>
                  <select
                    className="w-full mb-4 p-2 appearance-none shadow-md rounded bg-white"
                    value={formData.studentLevel}
                    onChange={(e) => handleChange(e, "studentLevel")}
                  >
                    <option className="text-primary/40" value="">
                      Selecciona el nivel
                    </option>
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                  <p className="font-medium">Reglas de estilo</p>
                  <input
                    className="w-full mb-4 p-2 shadow-md rounded bg-white   "
                    placeholder="Reglas de estilo"
                    value={formData.style}
                    onChange={(e) => handleChange(e, "style")}
                  />
                  <p className="font-medium">Modelo de IA</p>
                  <select
                    className="w-full mb-4 p-2 appearance-none shadow-md rounded bg-white"
                    value={formData.modelIA}
                    onChange={(e) => handleModelChange(e)}
                  >
                    <option className="text-primary/40" value="">
                      Selecciona un modelo
                    </option>
                    {models.map((model) => (
                      <option key={model._id} value={model._id}>
                        {model.modelType.name} - {model.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-1/2 h-full flex flex-col justify-center gap-1">
                  <p className="font-medium">Temas a evaluuar</p>
                  <textarea
                    className="w-full mb-4 p-2 h-1/4 shadow-md rounded resize-none bg-white   "
                    placeholder="Reglas de estilo"
                    value={formData.topic}
                    onChange={(e) => handleChange(e, "topic")}
                  />
                  <p className="font-medium">Restricciones</p>
                  <textarea
                    className="w-full mb-4 p-2 h-1/4 shadow-md rounded resize-none bg-white   "
                    placeholder="Reglas de estilo"
                    value={formData.constraints}
                    onChange={(e) => handleChange(e, "constraints")}
                  />
                </div>
              </div>
            )}

            {step === 2 && <a>a</a>}
          </div>
        )}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="bg-primary font-semibold text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={() => saveData()}
            className="bg-primary font-semibold text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="text-primary text-lg font-semibold mb-2">
              Configuracion guardada exitosamente
            </p>
            <button
              className="mt-2 px-4 py-1 bg-primary text-white rounded"
              onClick={goToRepositories}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Configurar;
