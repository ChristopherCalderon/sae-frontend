"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { FaGithub, FaRegCheckCircle, FaRegQuestionCircle } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  deleteFeedback,
  getFeedback,
  getRepoData,
  getTaskConfig,
  patchFeedback,
  postFeedback,
  postPullRequest,
} from "@/services/githubService";
import { useEffect, useState } from "react";
import Loading from "@/components/loader/Loading";
import { useSession } from "next-auth/react";

function entrega() {
  const searchParams = useSearchParams();
  const encodedData = searchParams.get("data");
  const { email, repo, org, assignment, name  } = JSON.parse(atob(encodedData));
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState();
  const [generating, setGenerating] = useState(false);
  const [adding, setAdding] = useState(false);
  const [taskConfig, setTaskConfig] = useState();

  const [showSuccessModal, setShowSuccessModal] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPullRequestModal, setShowPullRequestModal] = useState(false);
  const { data: session } = useSession();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getFeedback(email, repo, org);

      const configResponse = await getTaskConfig(
        response.idTaskGithubClassroom
      );
      setTaskConfig(configResponse.data);
      setFeedback(response);
    } catch (error) {
      console.error("Error:", error);
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFeedback = async (email, id, feedback) => {
    try {
      const res = await patchFeedback(email, id, feedback);
    } catch (error) {
      console.log(error);
    }
  };

  const createPullRequest = async () => {
    setShowPullRequestModal(false);
    try {
      setAdding(true);
      await postPullRequest(feedback.repo, feedback.feedback, org);
      getData();
      setAdding(false);

      setShowSuccessModal("Pull request agregado correctamente");
      setTimeout(() => {
        setShowSuccessModal("");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const getSubmissionData = async () => {
    try {
      const response = await getRepoData(
        feedback.repo,
        org,
        taskConfig.extension
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const generateFeedback = async () => {
    setShowConfirmModal(false);
    try {
      setGenerating(true);
      const repoData = await getSubmissionData();
      const payload = {
        grade: `${feedback.gradeValue}/${feedback.gradeTotal}`,
        email: feedback.email,
        reviewedBy: feedback.reviewedBy || session?.user?.name,
        assignment: {
          id: feedback.idTaskGithubClassroom,
        },
        repository: {
          name: feedback.repo,
        },
      };

      await deleteFeedback(feedback.email, feedback.idTaskGithubClassroom);
      const res = await postFeedback(payload, repoData, taskConfig,session.user.name);
      const newFeedback = res.feedback;
      const newData = await updateFeedback(
        feedback.email,
        feedback.idTaskGithubClassroom,
        newFeedback
      );
      getData();
      setGenerating(false);
      setShowSuccessModal("Retroalimentación generada correctamente");
      setTimeout(() => {
        setShowSuccessModal("");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  //Formatear fecha
  function formatFecha(fechaMongo) {
    const fecha = new Date(fechaMongo);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  }

  //Calcular promedio de calificaciones
  const calculateAverage = (grade1, grade2) => {
    const total = grade1 + grade2;
    return parseFloat((total / 2).toFixed(2));
  };

  useEffect(() => {
    getData();
  }, []);

  const pathname = usePathname();
  return (
       <div
      className="bg-background w-full min-h-screen p-5 py-8 flex flex-col gap-1 md:grid md:grid-cols-2 md:grid-rows-[auto_auto_1fr] 
    md:gap-4  mx-auto "
    >
      {/* Div 1: Cabecera */}
      <div className="order-1 md:col-span-2 p-4 text-center">
        <h1 className="font-semibold text-[20px] md:text-[26px] lg:text-[32px] leading-[24px] max-w-[250px] md:max-w-[382px] mx-auto font-[Bitter]">
          {name || "@UserGitHub"}
        </h1>
        <p className="text-[11px] md:text-[20px] leading-[13px] font-light text-center text-gray-500 max-w-[275px] md:max-w-[382px] mt-2 font-[Bitter] lg:mt-6 mx-auto">
          {assignment || "Nombre de la tarea"}
        </p>
      </div>

      {loading ? (
        <div className="order-2  md:order-2 col-span-2 ">
          <Loading />
        </div>
      ) : ( 
        <>
          {/* Div 2 Info general de resultados*/}
          <div className="order-2  p-4 text-left md:order-2 font-[Bitter] text-[11px] leading-[13px] md:text-[16px] md:leading-[18px]">
            {/* Título del repo */}
            <h1 className="font-bold text-[14px] md:text-[18px] lg:text-[20px] mb-3 break-all">
              {feedback.repo}
            </h1>

            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[11px]">
              {(() => {
                const grade1 = feedback.gradeValue ?? 0;
                const grade2 = feedback.gradeFeedback ?? 0;
                const average = calculateAverage(grade1, grade2);
                const colorClass =
                  average < 5.9 ? "text-red-600" : "text-green-600";
                return (
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-[11px] lg:text-[14px]">
                      Calificación:
                    </span>
                    <span className={`${colorClass} lg:text-[13px]`}>
                      {average}/10
                    </span>
                  </div>
                );
              })()}

              <div className="flex items-center">
                <a
                  className="flex items-center gap-1 underline hover:font-semibold text-[11px] lg:text-[14px]"
                  href={feedback.workflow_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="text-[11px] lg:text-[14px]" /> Ver
                  ejecución en GitHub
                </a>
              </div>

              <div>
                <span className="font-semibold text-[11px] lg:text-[14px]">
                  Generado con:
                </span>{" "}
                <span className="lg:text-[13px]">{feedback.modelIA}</span>
              </div>

              <div>
                <span className="font-semibold text-[11px] lg:text-[14px]">
                  Fecha de creación:
                </span>{" "}
                <span className=" lg:text-[14px]">
                  {formatFecha(feedback.createdAt)}
                </span>
              </div>

              <div>
                <span className="font-semibold text-[11px] lg:text-[14px]">
                  Nota del test:
                </span>{" "}
                <span className="lg:text-[13px]">{feedback.gradeValue}</span>
              </div>

              <div>
                <span className="font-semibold text-[11px] lg:text-[14px]">
                  Nota de retroalimentación:
                </span>{" "}
                <span className="lg:text-[13px]">{feedback.gradeFeedback}</span>
              </div>

              <div className="col-span-2">
                <span className="font-semibold text-[11px] lg:text-[14px]">
                  Revisado por:
                </span>{" "}
                <span className="lg:text-[13px]">
                  {" "}
                  {feedback.reviewedBy || "Sistema"}
                </span>
              </div>
            </div>
          </div>

          {/* Div 3 Botones*/}
          <div className="order-3 p-4 text-center md:order-3">
            <div className="flex flex-col items-center space-y-[10px]">
              {/* Botón 1: Editar retroalimentación */}
              <Link
                href={{
                  pathname: `${pathname}/editar`,
                  query: {
                    data: btoa(
                      JSON.stringify({
                        email: email,
                        repo: repo,
                        org: org,
                        name: name,
                      })
                    ),
                  },
                }}
                className="w-full max-w-[300px] flex items-center justify-center gap-2 font-semibold bg-secondary lg:text-[16px] text-white hover:text-white px-5 py-2 rounded-[8px] shadow-md hover:bg-primary-hover transition-all"
              >
                Editar retroalimentación
              </Link>

              {/* Botón 2: Agregar pull request */}
              {feedback.feedback_status === "Generado" && (
                <button
                  onClick={() => setShowPullRequestModal(true)}
                  disabled={adding}
                  className="w-full max-w-[300px] flex items-center justify-center gap-2 font-semibold bg-secondary lg:text-[16px] text-white hover:text-white px-5 py-2 rounded-[8px] shadow-md hover:bg-primary-hover transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {!adding ? "Agregar Pull Request" : "Agregando..."}
                </button>
              )}

              {/* Botón 3: Volver a generar */}
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={generating}
                className="w-full max-w-[300px] flex items-center justify-center gap-2 font-semibold bg-secondary lg:text-[16px] text-white hover:text-white px-5 py-2 rounded-[8px] shadow-md hover:bg-primary-hover transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {!generating ? "Volver a generar" : "Generando..."}
              </button>
            </div>
          </div>

          {/* Div 4 Retroalimentacion*/}
          <div className="order-4 md:col-span-2 md:order-4">
            <div
              className="w-full  p-5 rounded-md shadow-md overflow-y-auto max-h-[400px] lg:max-h-[350px] bg-white [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-background
        [&::-webkit-scrollbar-thumb]:bg-primary"
            >
              <ReactMarkdown>{feedback.feedback}</ReactMarkdown>
            </div>
          </div>
        </>
      )}

      {/* Modal de confirmacion-------------------------- */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-white w-full lg:w-1/4 flex flex-col gap-1 justify-center items-center p-6 rounded  text-center shadow-[0px_8px_8px_rgba(0,0,0,0.25)]">
            <FaRegQuestionCircle className="text-5xl" />
            <h1 className="text-2xl text-primary font-bold">
              Retroalimentación
            </h1>
            <p className="text-primary text-lg font-medium mb-2">
              ¿Está seguro de volver a generar la retroalimentación a {name}?
            </p>
            <div className="w-full flex gap-2 justify-center items-center">
              <button
                className="flex w-1/3 lg:w-1/3   items-center justify-center gap-2 font-semibold bg-white border-2 border-secondary text-secondary hover:text-white px-5 hover:bg-secondary py-1 rounded shadow-lg"
                onClick={generateFeedback}
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
          </div>
        </div>
      )}

      {/* Modal de Pull request */} 
      {showPullRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-white w-full lg:w-1/4 flex flex-col gap-1 justify-center items-center p-6 rounded  text-center shadow-[0px_8px_8px_rgba(0,0,0,0.25)]">
            <FaRegQuestionCircle className="text-5xl" />
            <h1 className="text-2xl text-primary font-bold">
              Pull Request
            </h1>
            <p className="text-primary text-lg font-medium mb-2">
              ¿Está seguro de agregar un pull request a {name}?
            </p>
            <div className="w-full flex gap-2 justify-center items-center">
              <button
                className="flex w-1/3 lg:w-1/3   items-center justify-center gap-2 font-semibold bg-white border-2 border-secondary text-secondary hover:text-white px-5 hover:bg-secondary py-1 rounded shadow-lg"
                onClick={createPullRequest}
              >
                Si
              </button>
              <button
                className="flex w-1/3 lg:w-1/3   items-center justify-center gap-2 font-semibold bg-white border-2 border-secondary text-secondary hover:text-white px-5 hover:bg-secondary py-1 rounded shadow-lg"
                onClick={() => setShowPullRequestModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default entrega;
