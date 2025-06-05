"use client";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import {
  createTaskConfig,
  getTaskConfig,
  getTeacherModels,
  updateTaskConfig,
} from "@/services/githubService";
import Loading from "@/components/loader/Loading";
import { useSession } from "next-auth/react";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaRegCheckCircle } from "react-icons/fa";

function Configurar() {
  const router = useRouter();
  const pathname = usePathname();
  const [taskId, setTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState();
  const [first, setFirst] = useState(true);
  const [showEmptyData, setShowEmptyData] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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

  //Mapeo de extensiones de lenguaje a sus respectivas extensiones
  const languageExtensions = {
    "C++": ".cpp",
    Java: ".java",
    "C#": ".cs",
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setFormData((prev) => ({
      ...prev,
      language: selectedLang,
      extension: languageExtensions[selectedLang] || "",
    }));
  };

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

  const emptyData = () => {
    const { language, modelIA, studentLevel, style, topic, constraints } =
      formData;

    return (
      language.trim() === "" ||
      modelIA.trim() === "" ||
      studentLevel.trim() === "" ||
      style.trim() === "" ||
      topic.trim() === "" ||
      constraints.trim() === ""
    );
  };

  const saveData = async () => {
    if (emptyData()) {
      setShowEmptyData(true);
      setTimeout(() => {
        setShowEmptyData(false);
      }, 2000);
      return;
    }

    try {
      if (first) {
        await createTaskConfig(taskId, formData);
      } else {
        await updateTaskConfig(taskId, formData);
      }
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);

      // Redirigir a la página de repositorios
      goToRepositories();

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
    <div className="bg-background flex flex-col gap-5 w-full h-screen py-8">
      {/* Header */}
      <div className="w-full flex flex-col items-center text-primary">
        <h1 className="font-semibold text-[20px] md:text-[26px] lg:text-[32px] leading-[24px] text-center max-w-[250px] md:max-w-[382px] font-[Bitter]">
          Tarea de programación
        </h1>
        <p className="text-[11px] md:text-[20px] leading-[13px] font-light text-center text-gray-500 max-w-[275px] md:max-w-[382px] mt-2 font-[Bitter] lg:mt-6">
          Vista general de configuración de la tarea
        </p>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="w-full p-2 md:max-w-[647px] flex flex-col gap-[9px] md:grid md:grid-cols-2 md:gap-x-[32px] md:gap-y-[16px] text-primary font-[Bitter] mx-auto">
            <div className="flex flex-col">
              <label className="text-[14px] font-bold md:text-[20px]">
                Lenguaje de programación
              </label>
              <div className="relative mt-2">
                <select
                  className="w-full appearance-none h-[32px] px-[10px] py-[6px] text-[10px] leading-[14px] rounded-[5px] bg-white
  md:w-[308px] md:h-[51px] md:px-[16px] md:py-[12px] md:text-[16px] md:leading-[20px]
  lg:h-[42px] lg:text-[14px] lg:leading-[18px]"
                  value={formData.language}
                  onChange={handleLanguageChange}
                >
                  <option value="">Selecciona el lenguaje</option>
                  <option value="C++">C++</option>
                  <option value="Java">Java</option>
                  <option value="C#">C#</option>
                </select>
                <IoIosArrowDown className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-lg text-secondary" />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[14px] font-bold md:text-[20px]">
                Modelo de IA
              </label>
              <div className="relative mt-2">
                <select
               className="w-full appearance-none h-[32px] px-[10px] py-[6px] text-[10px] leading-[14px] rounded-[5px] bg-white
  md:w-[308px] md:h-[51px] md:px-[16px] md:py-[12px] md:text-[16px] md:leading-[20px]
  lg:h-[42px] lg:text-[14px] lg:leading-[18px]"
                  value={formData.modelIA}
                  onChange={(e) => handleModelChange(e)}
                >
                  <option value="">Selecciona el modelo</option>
                  {models.map((model) => (
                    <option key={model._id} value={model._id}>
                      {model.modelType.name} - {model.name}
                    </option>
                  ))}
                </select>
                <IoIosArrowDown className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-lg text-secondary" />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[14px] font-bold md:text-[20px]">
                Nivel del estudiante
              </label>
              <div className="relative mt-2">
                <select
               className="w-full appearance-none h-[32px] px-[10px] py-[6px] text-[10px] leading-[14px] rounded-[5px] bg-white
  md:w-[308px] md:h-[51px] md:px-[16px] md:py-[12px] md:text-[16px] md:leading-[20px]
  lg:h-[42px] lg:text-[14px] lg:leading-[18px]"
                  value={formData.studentLevel}
                  onChange={(e) => handleChange(e, "studentLevel")}
                >
                  <option value="">Selecciona el nivel</option>
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
                <IoIosArrowDown className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-lg text-secondary" />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[14px] font-bold md:text-[20px]">
                Reglas de estilo
              </label>
              <input
                             className="w-full appearance-none h-[32px] px-[10px] py-[6px] text-[10px] leading-[14px] rounded-[5px] bg-white
  md:w-[308px] md:h-[51px] md:px-[16px] md:py-[12px] md:text-[16px] md:leading-[20px]
  lg:h-[42px] lg:text-[14px] lg:leading-[18px] lg:mt-2" placeholder="Google Style"
                value={formData.style}
                onChange={(e) => handleChange(e, "style")}
              />
            </div>
            <div className="col-span-2 flex flex-col">
              <label className="text-[14px] font-bold md:text-[20px]">
                Temas a evaluar
              </label>
              <div className="relative w-full">
                <textarea
                  maxLength={200}
                  className="w-full min-h-[60px] p-[10px] rounded-[5px] text-[11px] resize-none bg-white
                  md:text-[16px] md:h-[130px] lg:h-[130px] lg:text-[14px]"
                  value={formData.topic}
                  onChange={(e) => handleChange(e, "topic")}
                />
                <div className="absolute bottom-1 right-2 text-[10px] text-black/70 md:text-[14px] lg:text-[12px]">
                  {formData.topic.length}/200
                </div>
              </div>
            </div>

            <div className="col-span-2 flex flex-col">
              <label className="text-[14px] font-bold md:text-[20px]">
                Restricciones
              </label>
              <div className="relative w-full">
                <textarea
                  maxLength={200}
                  className="w-full h-[60px] p-[10px] rounded-[5px] text-[11px] resize-none bg-white
                  md:text-[16px] md:h-[130px] lg:h-[130px] lg:text-[14px]"
                  value={formData.constraints}
                  onChange={(e) => handleChange(e, "constraints")}
                />
                <div className="absolute bottom-1 right-2 text-[10px] text-black/70 md:text-[14px] lg:text-[12px]">
                  {formData.constraints.length}/200
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="w-full max-w-[271px] md:max-w-[647px] mx-auto flex justify-center gap-[13px] md:gap-[22px] mt-[10px]">
            <button
              onClick={() => router.back()}
              className="w-[80px] h-[36px] md:w-[200px] md:h-[42px] p-[10px] border-[2px] border-secondary text-secondary rounded-[5px] text-[14px] font-[Bitter] font-semibold bg-white"
            >
              Cancelar
            </button>
            <button
              onClick={() => saveData()}
              className="w-[80px] h-[36px] md:w-[200px] md:h-[42px] p-[10px] bg-secondary text-white rounded-[5px] text-[14px] font-[Bitter] font-semibold"
            >
              Guardar
            </button>
          </div>
        </>
      )}

      {/* Modal de confirmación */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-white w-full lg:w-1/4 flex flex-col gap-1 justify-center items-center p-6 rounded  text-center shadow-[0px_8px_8px_rgba(0,0,0,0.25)]">
            <FaRegCheckCircle className="text-5xl" />
            <h1 className="text-2xl text-primary font-bold">
              Configuración de la tarea
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

export default Configurar;
