import AssignmentCard from "@/components/cards/AssignmentCard";
import React from "react";

function tareas() {
  return (
    <div className="bg-background flex flex-col gap-5 w-full h-full p-8 overflow-clip">
    <div className="w-full text-primary ">
      <h1 className="text-2xl font-bold">Mis Tareas</h1>
      <p className="font-semibold">Nombre del curso</p>
    </div>
    <div className="w-full h-[90%] bg-white shadow-xl px-10 py-5 flex flex-col gap-3 overflow-y-scroll rounded-md">
      <AssignmentCard />
      <AssignmentCard />
      <AssignmentCard />
      <AssignmentCard />
      <AssignmentCard />
      <AssignmentCard />
      <AssignmentCard />
      <AssignmentCard />
    </div>
  </div>
  )
}

export default tareas