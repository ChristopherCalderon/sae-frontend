import React from "react";
import { FaUser, FaCheck, FaCheckDouble, FaLink, FaCogs } from "react-icons/fa";

function AssignmentCard() {
  return (
    <div className="bg-background w-full h-24 shadow-md rounded-md py-5 px-8 text-primary flex justify-center items-center gap-2">
      <div className="flex flex-col w-2/3 gap-2 ">
        <h1 className="text-lg font-bold">Tarea de programacion</h1>
        <div className="flex gap-5 font-medium">
          <span className="flex text-sm items-center gap-1 ">
            <FaUser />
            <p>Individual</p>
          </span>
          <span className="flex text-sm items-center gap-1">
            <FaCheck />
            <p>120 aceptados</p>
          </span>
          <span className="flex text-sm items-center gap-1">
            <FaCheckDouble />
            <p>60 entregados</p>
          </span>
          <button className="w-20 text-xs text-white font-medium bg-accent  rounded-md shadow-md ">
            Activo
          </button>
        </div>
      </div>

      <div className="flex flex-col w-1/3 gap-3 items-end text-white text-sm">
        <button className="flex items-center w-2/3 justify-center gap-2 bg-primary hover:bg-primary-hover  py-1 rounded">
          <FaLink />
          Copiar invitacion
        </button>
        <button className="flex items-center w-2/3  justify-center gap-2 bg-primary hover:bg-primary-hover py-1 rounded">
          <FaCogs />
          Configurar
        </button>
      </div>
    </div>
  );
}

export default AssignmentCard;
