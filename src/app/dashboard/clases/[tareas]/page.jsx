"use client";
import AssignmentCard from "@/components/cards/AssignmentCard";
import Loading from "@/components/loader/Loading";
import { getAssignments } from "@/services/githubService";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function tareas() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const {tareas} = useParams();   

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getAssignments(tareas);
      setAssignments(response?.data || []);
    } catch (error) {
      console.error("Error:", error);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      getData();
  }, []); 

  return (
    <div className="bg-background flex flex-col gap-5 w-full h-full p-8 overflow-clip">
      <div className="w-full text-primary ">
        <h1 className="text-2xl font-bold">Mis Tareas</h1>
        <p className="font-semibold">Nombre del curso</p>
      </div>
      <div
        className="w-full h-[90%] bg-white shadow-xl px-10 py-5 flex flex-col gap-3 overflow-y-scroll rounded-md
    [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-white
        [&::-webkit-scrollbar-thumb]:bg-primary"
      >
        {loading ? (
          <Loading />
        ) : assignments.length == 0 ? (
          <h1>No hay tareas disponibles</h1>
        ) : (
          assignments.map((assignment) => <AssignmentCard key={assignment.id} id={assignment.id}
          title={assignment.title} type={assignment.type} accepted={assignment.accepted} submissions={assignment.submissions}
          enabled={assignment.invitations_enabled} invite={assignment.invite_link} /> )
        )}
      </div>
    </div>
  );
}

export default tareas;
