"use client";
import ExcelButton from "@/components/buttons/ExcelButon";
import Loading from "@/components/loader/Loading";
import AssignmentTableCard from "@/components/tableCards/AssignmentTableCard";
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
import {
  FaCheckCircle,
  FaRegCheckCircle,
  FaRegQuestionCircle,
} from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { RiAiGenerate2 } from "react-icons/ri";

function tarea() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [teacher, setTeacher] = useState();
  const [config, setConfig] = useState();
  const [org, setOrg] = useState();
  const router = useRouter();
  const { id } = useParams();
  const { data: session, status } = useSession();

  const [globalFilter, setGlobalFilter] = useState(""); //Filtro de buscador
  // Filtrar submissions
  const filteredSubmissions = submissions.filter((submission) =>
    submission.students[0].name
      //.toLowerCase()
      //.startsWith(globalFilter.toLowerCase())
  );

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
    setShowConfirmModal(false);
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
            await postFeedback(submission, repoData, config, teacher);
          }
        })
      );
    } catch (error) {
      console.log("Error al generar retroalimentación", error);
    } finally {
      getData();
      setShowSuccessModal('Generar retroalimentación')
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      setOrg(session.user.selectedOrg);
      setTeacher(session.user.name)
      getData();
    } else if (status === "loading") {
      // Sesión aún cargando
      setLoading(true);
    }
  }, [status]);
  return (
    <div className="bg-background font-primary font-bold h-full flex flex-col items-center gap-5 w-full p-2 lg:p-5 py-8 overflow-clip">
      <div className="w-full flex flex-col items-center gap-2  text-primary">
        <div>
          <h1 className="text-2xl font-bold text-center">
            Tarea de programación
          </h1>
          <p className="font-semibold text-center">
            Vista general de los repositorios de los alumnos incritos en el
            curso
          </p>
        </div>
        {!loading &&         <div className="flex flex-col lg:flex-row w-full  gap-2">
          <input
            type="text"
            placeholder="Buscar nombre de repositorio..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className=" px-3 py-1 border-2 border-gray-300 rounded w-full lg:w-1/2"
          />
          <div className="flex flex-col lg:w-1/2 md:flex-row lg:flex-row justify-center items-center  gap-2">
          {submissions.some((submission) => submission.feedback_status == 'Pendiente') && !loading && (

            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex w-4/5 lg:w-full   items-center justify-center gap-2 font-semibold bg-white border-2 border-secondary text-secondary hover:text-white px-5 hover:bg-secondary py-1 rounded shadow-lg"
            >
              <RiAiGenerate2 className="text-xl" />
              Generar retroalimentaciones
            </button>
          )}
            <ExcelButton data={submissions} setModal={setShowSuccessModal} />
          </div>
        </div>}

      </div>

      <div
        className="w-full h-[90%] gap-3 overflow-y-scroll [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-background
        [&::-webkit-scrollbar-thumb]:bg-primary rounded-md"
      >
        {loading ? (
          <Loading />
        ) : submissions.length === 0 ? (
          <h1 className="text-center text-xl font-semibold">
            No se encontraron entregas
          </h1>
        ) : (
          <div className="w-full h-full flex flex-col gap-5">
            <AssignmentsTable
              submissions={filteredSubmissions}
              id={id}
              getFeedbacks={getData}
              config={config}
              org={org}
              globalFilter={globalFilter}
              setGlobalFilter={() => setGlobalFilter()}
              teacher={teacher}
            />

            {filteredSubmissions.map((submission) => (
              <AssignmentTableCard
                key={submission.id}
                submission={submission}
                id={id}
                getFeedbacks={getData}
                config={config}
                org={org}
                teacher={teacher}
              />
            ))}
          </div>
        )}
      </div>
      {/* Modal de confirmacion-------------------------- */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-white w-full lg:w-1/4 flex flex-col gap-1 justify-center items-center p-6 rounded  text-center shadow-[0px_8px_8px_rgba(0,0,0,0.25)]">
            <FaRegQuestionCircle className="text-5xl" />
            <h1 className="text-2xl text-primary font-bold">
              Generar retroalimentación
            </h1>
            <p className="text-primary text-lg font-medium mb-2">
              ¿Está seguro de generar retroalimentación para 
              todos los estudiantes?
            </p>
            <div className="w-full flex gap-2 justify-center items-center">
              <button
                className="flex w-1/3 lg:w-1/3   items-center justify-center gap-2 font-semibold bg-white border-2 border-secondary text-secondary hover:text-white px-5 hover:bg-secondary py-1 rounded shadow-lg"
                onClick={() => generateFeedback()}
              >
                Si
              </button>
              <button
                className="flex w-1/3 lg:w-1/3   items-center justify-center gap-2 font-semibold bg-white border-2 border-secondary text-secondary hover:text-white px-5 hover:bg-secondary py-1 rounded shadow-lg"
                onClick={() => setShowConfirmModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de exito-------------------------- */}
      {showSuccessModal != "" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-white w-full lg:w-1/4 flex flex-col gap-1 justify-center items-center p-6 rounded  text-center shadow-[0px_8px_8px_rgba(0,0,0,0.25)]">
            <FaRegCheckCircle className="text-5xl" />
            <h1 className="text-2xl text-primary font-bold">
              {showSuccessModal}
            </h1>
            <p className="text-primary text-lg font-medium mb-2">
              ¡Accion realizada con exito!
            </p>
            <button
              className="flex w-1/2 lg:w-1/2   items-center justify-center gap-2 font-semibold bg-white border-2 border-secondary text-secondary hover:text-white px-5 hover:bg-secondary py-1 rounded shadow-lg"
              onClick={() => setShowSuccessModal("")}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default tarea;
