"use client";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

function Configurar() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    lenguaje: "",
    nivel: "Intermedio",
    estilo: "",
    temas: [],
    restricciones: [],
    newTema: "",
    newRestriccion: "",
  });

  const handleChange = (e, field, index, section) => {
    if (section) {
      const newArr = [...formData[section]];
      newArr[index] = e.target.value;
      setFormData({ ...formData, [section]: newArr });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const addField = (section) => {
    setFormData({ ...formData, [section]: [...formData[section], ""] });
  };

  const removeField = (section, index) => {
    const newArr = formData[section].filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: newArr });
  };

  const cancelar = () => {
  };

  const guardar = () => {
    console.log("Datos enviados:", formData);
  };

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
        <h1 className="text-primary text-lg font-bold">Configurar tarea</h1>
        {step === 1 && (
          <div className="bg-background rounded-md h-[85%] p-8 flex flex-col items-center justify-center gap-5 text-primary">
            <h3 className="text-lg font-bold mb-4">Aspectos generales</h3>
            <div className="w-1/2 flex flex-col gap-1">
              <p className="font-medium">Lenguaje de programacion</p>
              <input
                className="w-full mb-4 p-2 shadow-md rounded bg-white"
                placeholder="Lenguaje de programación"
                value={formData.lenguaje}
                onChange={(e) => handleChange(e, "lenguaje")}
              />
              <p className="font-medium">Nivel de estudiante</p>
              <select
                className="w-full mb-4 p-2 appearance-none shadow-md rounded bg-white"
                value={formData.nivel}
                onChange={(e) => handleChange(e, "nivel")}
              >
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
              <p className="font-medium">Lenguaje de programacion</p>
              <input
                className="w-full mb-4 p-2 shadow-md rounded bg-white   "
                placeholder="Reglas de estilo"
                value={formData.estilo}
                onChange={(e) => handleChange(e, "estilo")}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={cancelar}
                className="bg-primary font-semibold text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => setStep(2)}
                className="bg-primary font-semibold text-white px-4 py-2 rounded"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

{step === 2 && (
  <div className="bg-background rounded-md h-[85%] p-8 flex flex-col items-center justify-center gap-5 text-primary">
    <h3 className="text-lg font-bold mb-4">Temas a evaluar y Restricciones</h3>
    <div className="w-full flex justify-center gap-8">
      {/* TEMAS */}
      <div className="flex flex-col w-1/3">
        <h4 className="font-semibold mb-2">Temas a evaluar</h4>
        <div className="flex flex-col gap-2 mb-2 h-50 overflow-y-auto [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-background
        [&::-webkit-scrollbar-thumb]:bg-primary">
          {formData.temas.map((tema, i) => (
            <div key={i} className="flex items-center justify-between bg-secondary px-3 py-1 rounded-md text-sm shadow-md">
              {tema}
              <button
                onClick={() => removeField("temas", i)}
                className="ml-2 text-primary"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Nuevo tema"
            className="w-full p-2 bg-white text-primary shadow-md rounded"
            value={formData.newTema || ""}
            onChange={(e) =>
              setFormData({ ...formData, newTema: e.target.value })
            }
          />
          <button
            onClick={() => {
              if (formData.newTema?.trim()) {
                addField("temas");
                setFormData({ ...formData, temas: [...formData.temas, formData.newTema], newTema: "" });
              }
            }}
            className="bg-primary font-semibold text-white px-3 shadow-md hover:bg-primary-hover rounded"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* DIVISOR */}
      <div className="inline-block h-[250px] min-h-[1em] w-0.5 bg-[#003C71]/10 justify-self-center"></div>

      {/* RESTRICCIONES */}
      <div className="flex flex-col w-1/3">
        <h4 className="font-semibold mb-2">Restricciones</h4>
        <div className="flex flex-col gap-2 mb-2 h-50 overflow-y-auto [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-background
        [&::-webkit-scrollbar-thumb]:bg-primary">
          {formData.restricciones.map((restriccion, i) => (
            <div key={i} className="flex items-center justify-between bg-secondary px-3 py-1 rounded-md text-sm shadow-md">
              {restriccion}
              <button
                onClick={() => removeField("restricciones", i)}
                className="ml-2 text-primary"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Nueva restricción"
            className="w-full p-2 bg-white text-primary shadow-md rounded"
            value={formData.newRestriccion || ""}
            onChange={(e) =>
              setFormData({ ...formData, newRestriccion: e.target.value })
            }
          />
          <button
            onClick={() => {
              if (formData.newRestriccion?.trim()) {
                setFormData({
                  ...formData,
                  restricciones: [...formData.restricciones, formData.newRestriccion],
                  newRestriccion: "",
                });
              }
            }}
            className="bg-primary hover:bg-primary-hover shadow-md font-semibold text-white px-3 rounded"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>

    <div className="flex gap-4 mt-6">
      <button
        onClick={() => setStep(1)}
        className="bg-primary font-semibold text-white px-4 py-2 rounded"
      >
        Regresar
      </button>
      <button
        onClick={guardar}
        className="bg-primary font-semibold text-white px-4 py-2 rounded"
      >
        Guardar
      </button>
    </div>
  </div>
)}

      </div>
    </div>
  );
}

export default Configurar;
