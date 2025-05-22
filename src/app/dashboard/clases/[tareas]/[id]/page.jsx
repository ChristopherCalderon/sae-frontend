"use client";
import ExcelButton from "@/components/buttons/ExcelButon";
import Loading from "@/components/loader/Loading";
import AssignmentsTable from "@/components/tables/AssignmentsTable";
import {
  getRepoData,
  getSubmissions,
  getTaskConfig,
  postFeedback,
} from "@/services/githubService";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { IoMdDownload } from "react-icons/io";
import { RiAiGenerate2 } from "react-icons/ri";

function tarea() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState();
  const [org, setOrg] = useState()
  const router = useRouter();
  const { id } = useParams();
    const { data: session, status } = useSession();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getSubmissions(id);
      console.log(response);
      setSubmissions(response || []);
      const taskResponse = await getTaskConfig(id);
      if (!taskResponse) {
        if (!window.location.pathname.endsWith("/configurar")) {
          router.push(`${window.location.pathname}/configurar`);
        }
      } else {
        setConfig(taskResponse.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmissions([]);
    } finally {
    }
  };

  const getSubmissionData = async (repoName) => {
    try {
      const response = await getRepoData(repoName, org, config.extension);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const generateFeedback = async () => {
    setLoading(true);
    try {
      await Promise.all(
        submissions.map(async (submission) => {
          if (submission.feedback_status === "Pendiente") {
            console.log(submission.repository.name);
            const repoData = await getSubmissionData(
              submission.repository.name
            );
            console.log(repoData);
            await postFeedback(submission, repoData, config);
          }
        })
      );
    } catch (error) {
      console.log("Error al generar retroalimentación", error);
    } finally {
      getData();
    }
  };

  useEffect(() => {
    if (status === "authenticated" ) {

      setOrg(session.user.selectedOrg)
      getData();
    } else if (status === "loading") {
      // Sesión aún cargando
      setLoading(true);
    }
  }, [status]); 
  return (
    <div className="bg-background font-primary font-bold h-full flex flex-col items-center gap-5 w-full p-5 py-8 overflow-clip">
      <div className="w-full flex flex-col items-center  text-primary">
        <div>
          <h1 className="text-2xl font-bold">Tarea de programación</h1>
          <p className="font-semibold">
            Vista general de los repositorios de los alumnos incritos en el
            curso
          </p>
        </div>
        {/* <div className="flex gap-3">
          <button
            onClick={() => generateFeedback()}
            className="flex items-center justify-center gap-2 font-semibold bg-secondary text-primary hover:text-white px-5 hover:bg-primary py-1 rounded shadow-lg"
          >
            <RiAiGenerate2 className="text-xl" />
            Generar retroalimentacion
          </button>
          <ExcelButton data={submissions} />
        </div> */}
      </div>

      <div
        className="w-full h-[90%] gap-3 overflow-y-scroll [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-background
        [&::-webkit-scrollbar-thumb]:bg-primary rounded-md"
      >
        {loading ? (
          <Loading />
        ) : submissions.length === 0 ? (
          <h1 className="text-center text-xl font-semibold">No se encontraron entregas</h1>
        ) : (
          <AssignmentsTable
            submissions={submissions}
            id={id}
            getFeedbacks={getData}
            config={config}
            org={org}
          />
        )}
      </div>
    </div>
  );
}

export default tarea;
