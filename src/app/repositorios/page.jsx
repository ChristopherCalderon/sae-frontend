"use client";
import ExcelButton from "@/components/buttons/ExcelButon";
import Loading from "@/components/loader/Loading";
import { signIn, signOut, useSession } from "next-auth/react";
import AssignmentsTable from "@/components/tables/AssignmentsTable";
import {
  FaGithub,
  FaRegCheckCircle,
  FaRegQuestionCircle,
} from "react-icons/fa";
import {
  getRepoData,
  getSubmissions,
  getTaskConfig,
  postFeedback,
} from "@/services/githubService";
import { decodeToken, postGrades } from "@/services/ltiService";
import { useRouter, useParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { IoMdDownload } from "react-icons/io";
import { RiAiGenerate2 } from "react-icons/ri";
import AssignmentTableCard from "@/components/tableCards/AssignmentTableCard";

function repositorios() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState();
  const [data, setData] = useState();
  const [sendModal, setSendModal] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [teacher, setTeacher] = useState();
  const [showSuccessModal, setShowSuccessModal] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const router = useRouter();
  const { id } = useParams();
  const { data: session, status } = useSession();
  const [globalFilter, setGlobalFilter] = useState(""); //Filtro de buscador
  // Filtrar submissions
  const filteredSubmissions = submissions.filter((submission) =>
    submission.students[0].login
      .toLowerCase()
      .startsWith(globalFilter.toLowerCase())
  );

  const token =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("token")
      : null;

  const getData = async () => {
    try {
      setLoading(true);
      const decodedRes = await decodeToken(token);
      console.log(decodedRes);
      const response = await getSubmissions(decodedRes.idtaskgithub);
      setSubmissions(response || []);
      const taskResponse = await getTaskConfig(decodedRes.idtaskgithub);
      setConfig(taskResponse.data);
      setLoading(false);

      setData(decodedRes);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const sendGrades = async () => {
    try {
      await postGrades(5, "a");
    } catch (error) {
      console.log(error);
    }
  };

  const getSubmissionData = async (repoName) => {
    try {
      const response = await getRepoData(
        repoName,
        data.orgName,
        config.extension
      );
      console.log("-----------------Repo Data");
      console.log(response);
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
            await generateFeedback(submission, repoData, config, teacher);
          }
        })
      );
    } catch (error) {
      console.log("Error al generar retroalimentación", error);
    } finally {
      getData();

      setShowSuccessModal("Generar retroalimentación");
    }
  };

  const handleSignIn = async () => {
    await signIn("github");
  };

  useEffect(() => {
    if (!token) {
      router.push("/");
    } else if (token && status === "authenticated") {
      
      setTeacher(session.user.name)
      getData();
    } else {
      setLoading(false);
    }
  }, [token, status]);

  return (
    <div className="bg-background font-primary font-bold h-screen flex flex-col items-center gap-5 w-full p-2 lg:p-5 py-8 overflow-clip">
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
        <div className="flex flex-col lg:flex-row w-full  gap-2">
          <input
            type="text"
            placeholder="Buscar nombre de repositorio..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className=" px-3 py-1 border-2 border-gray-300 rounded w-full lg:w-1/2"
          />
          <div className="w-full lg:w-1/2">
            {status === "unauthenticated" ? (
              <div className="flex gap-3 w-full justify-center lg:justify-end">
                <button
                  onClick={handleSignIn}
                  className="font-mono font-normal w-4/5 lg:w-1/2 bg-black text-[13px] text-white flex items-center justify-center px-4 py-2 rounded-md 
                                      shadow hover:bg-gray-800 transition"
                >
                  <FaGithub className="mr-2" />
                  Login with GitHub
                </button>
              </div>
            ) : (
              <div className="flex flex-col lg:w-full md:flex-row lg:flex-row justify-center items-center  gap-2">
                {submissions.every(
                  (submission) => submission.feedback_status === "Enviado"
                ) && !loading ? (
                  <button
                    onClick={() => setSendModal(true)}
                    className="flex w-4/5 lg:w-full   items-center justify-center gap-2 font-semibold bg-white border-2 border-secondary text-secondary hover:text-white px-5 hover:bg-secondary py-1 rounded shadow-lg"
                  >
                    <RiAiGenerate2 className="text-xl" />
                    Enviar notas
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="flex w-4/5 lg:w-full   items-center justify-center gap-2 font-semibold bg-white border-2 border-secondary text-secondary hover:text-white px-5 hover:bg-secondary py-1 rounded shadow-lg"
                  >
                    <RiAiGenerate2 className="text-xl" />
                    Generar retroalimentacion
                  </button>
                )}

                <ExcelButton
                  data={submissions}
                  setModal={setShowSuccessModal}
                />
              </div>
            )}
          </div>
        </div>
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
            {status == "unauthenticated"
              ? "Inicie sesion para visualizar las tareas"
              : "No se encontraron entregas"}
          </h1>
        ) : (
          <div className="w-full h-full flex flex-col gap-5">
            <AssignmentsTable
              submissions={filteredSubmissions}
              id={data.idtaskgithub}
              getFeedbacks={getData}
              config={config}
              org={data.orgName}
              globalFilter={globalFilter}
              setGlobalFilter={() => setGlobalFilter()}
              teacher={teacher}
            />

            {filteredSubmissions.map((submission) => (
              <AssignmentTableCard
                key={submission.id}
                submission={submission}
                id={data.idtaskgithub}
                getFeedbacks={getData}
                config={config}
                org={data.orgName}
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
              ¿Está seguro de generar retroalimentación para todos los
              estudiantes?
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
      {sendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full lg:w-1/4 flex flex-col gap-1 justify-center items-center p-6 rounded  text-center shadow-[0px_8px_8px_rgba(0,0,0,0.25)]">
            <h1 className="text-2xl text-primary font-bold">
              Enviar notas
            </h1>
            <p className="text-primary text-lg font-medium mb-2">
              Sera redirigido al moodle, seleccione nuevamente esta tarea para
              enviar las notas
            </p>
            <div className="flex gap-5 w-full justify-center">
              <button
                onClick={() => setSendModal(false)}
                className="flex w-1/3 lg:w-1/3   items-center justify-center gap-2 font-semibold bg-white border-2 border-secondary text-secondary hover:text-white px-5 hover:bg-secondary py-1 rounded shadow-lg"
              >
                Cancelar
              </button>
              <a
                href={data.url_return}
                className="flex w-1/3 lg:w-1/3   items-center justify-center gap-2 font-semibold bg-white border-2 border-secondary text-secondary hover:text-white px-5 hover:bg-secondary py-1 rounded shadow-lg"
              >
                Confirmar
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default repositorios;
