"use client";
import Loading from "@/components/loader/Loading";
import AssignmentsTable from "@/components/tables/AssignmentsTable";
import { getRepoData, getSubmissions, postFeedback } from "@/services/githubService";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoMdDownload } from "react-icons/io";
import { RiAiGenerate2 } from "react-icons/ri";

function tarea() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const {id} = useParams();   

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getSubmissions(id);
      console.log(response);
      setSubmissions(response || []);
    } catch (error) {
      console.error("Error:", error);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const getSubmissionData = async (repoName) => {
    try {
      const response = await getRepoData(repoName);
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
          console.log(submission.repository.name)
          const repoData = await getSubmissionData(submission.repository.name);
          console.log(repoData)
          await postFeedback(submission, repoData);
        })
      );
    } catch (error) {
      console.log("Error al generar retroalimentación", error);
    } finally {
      getData();
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="bg-background flex flex-col gap-5 w-full h-full p-8 overflow-clip">
      <div className="w-full text-primary flex items-center justify-between ">
        <div>
          <h1 className="text-2xl font-bold">Tarea de programación</h1>
          <p className="font-semibold">
            Vista general de los repositorios de los alumnos incritos en el
            curso
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => generateFeedback()} 
          className="flex items-center justify-center gap-2 font-semibold bg-secondary text-primary hover:text-white px-5 hover:bg-primary py-1 rounded shadow-lg">
            <RiAiGenerate2 className="text-xl" />
            Generar retroalimentacion
          </button>
          <button className="flex items-center justify-center gap-2 font-semibold bg-secondary text-primary hover:text-white px-5 hover:bg-primary py-1 rounded shadow-lg">
            <IoMdDownload className="text-xl" />
            Descargar notas
          </button>
        </div>
      </div>
      <div
        className="w-full h-[90%] bg-white shadow-xl px-3 py-5 gap-3 overflow-y-scroll [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-white
        [&::-webkit-scrollbar-thumb]:bg-primary rounded-md"
      >
        {loading ? (
          <Loading />
        ) : submissions.length === 0 ? (
          <h1>No se encontraron entregas</h1>
        ) : (
          <AssignmentsTable submissions={submissions} id={id} getFeedbacks={getData}/>
        )}
      </div>
    </div>
  );
}

export default tarea;
