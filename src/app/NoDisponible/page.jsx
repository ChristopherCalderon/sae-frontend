import React from 'react'
import { MdConstruction } from "react-icons/md";

function noDisponible() {
  return (
    <div className="bg-background h-screen flex flex-col gap-5 w-full p-8 overflow-clip">
    <div className="w-full text-primary">
      <h1 className="text-2xl font-bold">No disponible</h1>
    </div>
    <div
      className="w-full h-[90%]  bg-white shadow-xl text-primary font-medium px-3 py-5 gap-3 rounded-md flex flex-col 
  justify-center items-center text-lg"
    >
        <MdConstruction className='text-8xl'/>
        <h1 className='text-2xl font-bold'>¡Regresa pronto!</h1>
        <p>Esta tarea aun se encuentra en configuracion por parte del catedratico.</p>
    </div>
  </div>
  )
}

export default noDisponible