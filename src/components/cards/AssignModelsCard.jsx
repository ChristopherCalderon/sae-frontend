'use client';
import React, { useState } from 'react';
import { ImCancelCircle } from 'react-icons/im';
import { IoIosArrowDown } from 'react-icons/io';

export default function AsignarModelosCard() {
  const [modelos, setModelos] = useState(['Modelo 1', 'Modelo 1']);
  const [modeloSeleccionado, setModeloSeleccionado] = useState('');

  const modelosDisponibles = ['Modelo 1', 'Modelo 2', 'Modelo 3'];

  const handleAgregarModelo = () => {
    if (modeloSeleccionado && !modelos.includes(modeloSeleccionado)) {
      setModelos([...modelos, modeloSeleccionado]);
      setModeloSeleccionado('');
    }
  };

  const handleEliminar = (modelo) => {
    setModelos(modelos.filter((m) => m !== modelo));
  };

  const tieneScroll = modelos.length >= 2;

  return (
    <div className="bg-white w-[450px] p-10 rounded-lg shadow-lg mx-auto">
      <h2 className="text-center font-mono text-2xl font-bold text-primary mb-8">
        Asignar modelos
      </h2>

      <div className="font-mono text-primary space-y-4">
        <div>
          <p className="font-bold">Asignatura</p>
          <p className="ml-10">Fundamentos de programación</p>
        </div>

        <div>
          <p className="font-bold">Catedratico</p>
          <p className="ml-10">Nestor Aldana</p>
        </div>

        <div>
          <p className="font-bold">Modelos</p>

          <div
            className={`ml-10 space-y-2 ${
              tieneScroll ? 'max-h-28 overflow-y-auto pr-2' : ''
            }`}
          >
            {modelos.map((modelo, index) => (
              <div
                key={index}
                className="bg-secondary text-primary flex justify-between items-center px-4 py-2 rounded"
              >
                <span>{modelo}</span>
                <button
                  onClick={() => handleEliminar(modelo)}
                  className="text-lg font-bold hover:text-red-600"
                >
                  <ImCancelCircle />
                </button>
              </div>
            ))}
          </div>

          <div className="relative mt-2 ml-10">
            <select
              value={modeloSeleccionado}
              onChange={(e) => setModeloSeleccionado(e.target.value)}
              onBlur={handleAgregarModelo}
              className="w-full px-3 pr-10 py-2 bg-white border rounded appearance-none focus:outline-none"
            >
              <option value="">Agregar modelo</option>
              {modelosDisponibles
                .filter((m) => !modelos.includes(m))
                .map((modelo, idx) => (
                  <option key={idx} value={modelo}>
                    {modelo}
                  </option>
                ))}
            </select>
            <IoIosArrowDown className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-primary text-xl" />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button className="bg-primary hover:bg-primary-hover text-white font-bold font-mono px-8 py-2 rounded-md shadow">
          Aceptar
        </button>
      </div>
    </div>
  );
}
