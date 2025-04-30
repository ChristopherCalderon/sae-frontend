"use client";
import React, { useEffect, useState } from "react";
import ManagementTable from "@/components/tables/ManagementTable";
import { getClasses, getTeachers } from "@/services/githubService";
import { useSession } from "next-auth/react";
import Loading from "@/components/loader/Loading";

function AdminPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState();
  const [classes, setClasses] = useState();

  const getData = async (orgId) => {
    try {
      setLoading(true);
      const response = await getTeachers(orgId);
      const responseClasses = await getClasses(orgId);
      if (response && responseClasses) {
        console.log(response);
        console.log(responseClasses);
        setTeachers(response);
        setClasses(responseClasses.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      getData(session.user.selectedOrgId);
    } else if (status === "loading") {
      // Sesión aún cargando
      setLoading(true);
    }
  }, [status]);

  return (
    <div className="bg-background flex flex-col gap-5 w-full h-full p-8 ">
      <div className="w-full text-primary ">
        <h1 className="text-2xl font-mono font-bold">Administrar secciones</h1>
        <p className="font-mono">Asigna modelos de IA por secciones</p>
      </div>

      <div className="w-full h-11/12 bg-white shadow-xl">
        {loading ? <Loading /> : <ManagementTable classes={classes} teachers={teachers}/>}
      </div>
    </div>
  );
}

export default AdminPage;
