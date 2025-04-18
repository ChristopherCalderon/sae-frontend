'use client'

import React, { useState } from 'react'
import { ImCancelCircle } from 'react-icons/im'
import { IoIosArrowDown } from 'react-icons/io';

function SubjectPage() {
    const [modelos, setModelos] = useState(['Modelo 1', 'Modelo 1'])

    const eliminarModelo = (index) => {
        const nuevosModelos = modelos.filter((_, i) => i !== index)
        setModelos(nuevosModelos)
    }

    return (
        <div className="bg-background flex flex-col gap-5 w-full h-full p-8">
            <div className="w-full text-primary font-mono">
                <h1 className="text-2xl font-bold">Nombre de asignatura</h1>
                <p>Asigna modelos de IA por secciones</p>
            </div>

            <div className="w-full h-full bg-white shadow-xl p-8 rounded-md">
                <div className="grid grid-cols-2 gap-10 h-full">

                    <div className="font-mono text-primary space-y-6 border-r-2 border-gray-300 pr-10">
                        <h2 className="text-center text-xl font-bold">Informacion</h2>

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
                            <div className="ml-10 space-y-2">
                                {modelos.map((modelo, index) => (
                                    <div
                                        key={index}
                                        className="bg-blue-100 px-4 py-2 w-sm rounded shadow-md flex justify-between items-center"
                                    >
                                        <span>{modelo}</span>
                                        <button
                                            onClick={() => eliminarModelo(index)}
                                            className="text-primary hover:text-red-800 text-lg"
                                        >
                                            <ImCancelCircle />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

        
                    <div className="font-mono text-primary space-y-4 flex flex-col items-center">
                        <h2 className="text-xl font-bold">Agregar modelo</h2>

                        <div className="w-full max-w-sm">
                            <label className="font-bold">Proveedor</label>
                            <div className="relative mt-2">
                                <select
                                    className="w-full px-3 py-2 bg-background rounded appearance-none focus:outline-none shadow-md"
                                    defaultValue=""
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
                                className="w-full mt-2 px-3 py-2 rounded-md bg-background shadow-md focus:outline-none"
                            />
                        </div>

                        <div className="w-full max-w-sm">
                            <label className="font-bold">Nombre de la llave:</label>
                            <input
                                type="text"
                                className="w-full mt-2 px-3 py-2 rounded-md bg-background shadow-md focus:outline-none"
                            />
                        </div>

                        <div className="w-full max-w-sm">
                            <label className="font-bold">Llave:</label>
                            <input
                                type="text"
                                className="w-full mt-2 px-3 py-2 rounded-md bg-background shadow-md focus:outline-none"
                            />
                        </div>

                        <div className="pt-4">
                            <button className="w-48 mx-auto bg-primary text-white font-bold py-2 rounded shadow hover:bg-primary-hover">
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubjectPage
