import React from 'react'
import { FaTools, FaWrench } from 'react-icons/fa';
import { MdConstruction } from "react-icons/md";

function noDisponible() {
  return (
    <div className="bg-background h-screen flex flex-col items-center justify-center gap-5 w-full p-4 lg:p-8 shadow-[0px_8px_8px_rgba(0,0,0,0.25)]">
      <div
        className="w-full md:w-2/3 h-1/2 md:h-2/3 bg-white shadow-xl text-primary font-medium px-3 py-5 gap-3 rounded-md flex flex-col 
    justify-center items-center text-lg"
      >
          <div className="gap-3 p-5 w-full  flex flex-col  justify-center items-center">
            <FaWrench className="text-8xl text-secondary" />
            <h1 className="font-bold">
              ¡Regresa pronto!
            </h1>
            <p className="w-full text-center">
              Esta tarea aun se encuentra en configuracion por parte del catedratico.
            </p>
          </div>
      </div>
    </div>
  )
}

export default noDisponible