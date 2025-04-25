"use client";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ClassCard from "@/components/cards/ClassCard";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getClasses } from "@/services/githubService";
import Loading from "@/components/loader/Loading";

export default function Clases() {

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession(); // Obtenemos el status

  const getData = async (orgId) => {
    try {
      setLoading(true);
      console.log(orgId)
      const response = await getClasses(orgId);
      setClasses(response?.data || []);
    } catch (error) {
      console.error("Error al obtener clases:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(status)

  useEffect(() => {
    if (status === "authenticated" ) {
      getData(session.user.selectedOrgId)
    } else if (status === "loading") {
      // Sesión aún cargando
      setLoading(true);
    }
  }, [status]); 

  return (
    <div className="bg-background flex flex-col gap-5 w-full h-full p-8 overflow-clip">
      <div className="w-full text-primary ">
        <h1 className="text-2xl font-bold">Mis Clases</h1>
        <p className="font-semibold">Vista general de los cursos</p>
      </div>
      <div
        className={`w-full h-[90%] bg-white shadow-xl px-3 py-5  ${
          loading ? " " : "grid grid-cols-2"
        } gap-3 overflow-y-scroll  rounded-md
      [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-white
        [&::-webkit-scrollbar-thumb]:bg-primary`}
      >
        {loading ? (
          <Loading />
        ) : classes.length === 0 ? (
          <p>No hay clases disponibles</p>
        ) : (
          classes.map((clase) => (
            <ClassCard
              key={clase.id}
              id={clase.id}
              name={clase.name}
              url={clase.url}
              status={clase.archived}
            />
          ))
        )}
      </div>
    </div>
  );
}
