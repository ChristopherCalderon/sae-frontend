"use client";
import AssignmentCard from "@/components/cards/AssignmentCard";
import Loading from "@/components/loader/Loading";
import { getAssignments } from "@/services/githubService";
import { decodeToken, getLinkedTasks } from "@/services/ltiService";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function tareas() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orgId, setOrgId] = useState();
  const [orgName, setOrgName] = useState();
  const [linkedTasks, setLinkedTasks] = useState();
  const [ltiData, setLtiData] = useState();

  const { data: session, status } = useSession(); // Obtenemos el status
  const { tareas } = useParams();

  const getData = async () => {
    try {
      setLoading(true);

      // 1. Obtener el token de sessionStorage
      const token = sessionStorage.getItem("jwtToken");

      if (token) {
        // 2. Decodificar el token para obtener información del curso
        const decodedData = await decodeToken(token);
        const linkedTasks = await getLinkedTasks(tareas);

        setLinkedTasks(linkedTasks.data);
        console.log("Datos decodificados:", decodedData);
        setLtiData(decodedData);
      }
      console.log(tareas);
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
    if (status === "authenticated") {
      setOrgId(session.user.selectedOrgId);
      setOrgName(session.user.selectedOrg);
      getData();
    } else if (status === "loading") {
      // Sesión aún cargando
      setLoading(true);
    }
  }, [status]);

  return (
    <div className="bg-background font-primary font-bold h-full flex flex-col items-center gap-5 w-full p-5 py-8 overflow-clip">
      <div className="w-full flex flex-col items-center  text-primary">
        <h1 className="text-2xl font-semibold">Tareas del curso</h1>
        {ltiData ? (
          <p className="font-light text-center text-sm">
            Selecciona una tarea para conectar
          </p>
        ) : (
          ""
        )}
      </div>
      <div
        className={`w-full  max-h-[90%] py-5  ${
          loading ? " " : "grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3"
        } gap-5 overflow-y-scroll  rounded-md
      [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-background
        [&::-webkit-scrollbar-thumb]:bg-primary`}
      >
        {loading ? (
          <Loading />
        ) : assignments.length == 0 ? (
          <h1>No hay tareas disponibles</h1>
        ) : (
          assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              id={assignment.id}
              title={assignment.title}
              type={assignment.type}
              accepted={assignment.accepted}
              submissions={assignment.submissions}
              enabled={assignment.invitations_enabled}
              invite={assignment.invite_link}
              ltiData={ltiData}
              orgId={orgId}
              orgName={orgName}
              classroom={tareas}
              linkedTasks={linkedTasks}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default tareas;
