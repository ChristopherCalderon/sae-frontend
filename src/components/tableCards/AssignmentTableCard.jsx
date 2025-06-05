"use client";
import { generateFeedback, getRepoData, postFeedback } from "@/services/githubService";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

function getFeedbackColor(status) {
  if (status === "Enviado") return "bg-secondary";
  if (status === "Pendiente") return "bg-[#710000]";
  return "bg-primary";
}

//Funcion que genera feedback de la tarea seleccionada
const generateOne = async (
  repo,
  id,
  setLoading,
  setSuccessMessage,
  getFeedbacks,
  config,
  org,
  teacher
) => {
  setLoading(true);
  try {
    console.log(config);
    const repoData = await getData(repo.repository.name, org, config.extension);
    await generateFeedback(repo, repoData, config, teacher);
    setSuccessMessage("Generado correctamente");
  } catch (error) {
    console.log("Error al generar retroalimentación", error);
    setSuccessMessage("Error al generar retroalimentación");
  } finally {
    setLoading(false);
    setTimeout(() => setSuccessMessage(null), 2000);
    getFeedbacks();
  }
};

//Funcion para recoger la informacion de repositorios
const getData = async (repoName, org, extension) => {
  try {
    const response = await getRepoData(repoName, org, extension);
    return response;
  } catch (error) {
    console.log(error);
  }
};

function AssignmentTableCard({
  submission,
  id,
  getFeedbacks,
  config,
  org,
  teacher,
}) {
  const pathname = usePathname(); //Pathname para guardar la ruta actual
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  return (
    <div className="bg-white flex w-full  rounded-md flex-col   text-primary  justify-center  shadow-[0px_8px_8px_rgba(0,0,0,0.25)] lg:hidden ">
      <div className="w-full flex">
        <div className="bg-[#dcdcdc] h-full rounded-tl-md  w-2/5 py-6 p-2 flex items-center justify-center text-center text-sm ">
          <h1>Usuario</h1>
        </div>
        <div className="bg-white h-full py-3   w-3/5 flex items-center justify-center  gap-1 ">
          <img
            src={submission.students?.[0]?.avatar_url}
            alt="avatar"
            className="w-8 h-8  md:w-10 md:h-10 rounded-full"
          />
          <div className=" flex flex-col text-xs md:text-sm font-medium ">
            <p>{submission.students?.[0]?.login}</p>
            <p className="font-normal text-[9px] md:text-xs break-words whitespace-normal">
              {submission.email}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full flex">
        <div className="bg-[#dcdcdc] h-full w-2/5 p-2 flex items-center justify-center text-sm">
          <h1>Repositorio</h1>
        </div>
        <div className="bg-white h-full w-3/5 flex items-center justify-center  gap-1  text-sm font-medium">
          <a
            className="text-secondary text-xs md:text-sm underline hover:font-semibold text-center"
            href={submission.repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {submission.repository.name}
          </a>
        </div>
      </div>

      <div className="w-full flex">
        <div className="bg-[#dcdcdc] h-full w-2/5 p-2 flex items-center justify-center text-sm text-center">
          <h1>Nota de tests</h1>
        </div>
        <div className="bg-white h-full w-3/5 flex items-center justify-center  gap-1  text-sm font-medium">
          <p>{submission.grade_test}</p>
        </div>
      </div>

      <div className="w-full flex">
        <div className="bg-[#dcdcdc] h-full w-2/5 p-2 flex items-center justify-center text-center md:text-sm text-xs">
          <h1>Nota de retroalimentacion</h1>
        </div>
        <div className="bg-white h-full w-3/5 flex items-center justify-center  gap-1  text-sm font-medium">
          <p>{submission.grade_feedback}</p>
        </div>
      </div>

      <div className="w-full flex">
        <div className="bg-[#dcdcdc] h-full w-2/5 p-2 flex items-center justify-center text-center text-sm">
          <h1>Estado</h1>
        </div>
        <div className="bg-white h-full w-3/5 flex items-center justify-center  gap-1  text-xs md:text-sm font-medium">
          <div className="flex gap-1 h-full  justify-center items-center">
            <div
              className={`w-3 h-3 rounded-full ${getFeedbackColor(
                submission.feedback_status
              )}`}
            ></div>
            <p className="">{submission.feedback_status}</p>
          </div>
        </div>
      </div>

      {submission.feedback_status === "Pendiente" ? (
        <button
          onClick={() =>
            generateOne(
              submission,
              id,
              setLoading,
              setSuccessMessage,
              getFeedbacks,
              config,
              org,
              teacher
            )
          }
          className=" w-full text-center border-secondary border-2 text-secondary hover:bg-secondary hover:text-white  font-bold  px-3 py-2 rounded"
        >
          {loading ? "Generando..." : "Generar"}
        </button>
      ) : submission.feedback_status === "Generado" ||
        submission.feedback_status === "Enviado" ? (
        <Link
          href={{
            pathname: `${pathname}/${submission.id}`,
            query: {
              data: btoa(
                JSON.stringify({
                  email: submission.email,
                  repo: submission.assignment.id,
                  org: org,
                  assignment: submission.assignment.title,
                  name: submission.students[0].name,
                })
              ),
            },
          }}
          className=" w-full text-center border-secondary border-2 text-secondary hover:bg-secondary hover:text-white  font-bold  px-3 py-2 rounded"
        >
          Ver retroalimentacion
        </Link>
      ) : (
        ""
      )}
    </div>
  );
}

export default AssignmentTableCard;
