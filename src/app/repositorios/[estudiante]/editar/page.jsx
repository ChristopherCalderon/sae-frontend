"use client";
import React, { useEffect, useState } from "react";
import { FaGithub, FaSave, FaTimes } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { useRouter, useSearchParams } from "next/navigation";
import { getFeedback, patchFeedback } from "@/services/githubService";
import Loading from "@/components/loader/Loading";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
import { useMemo } from "react";

function editar() {
  const searchParams = useSearchParams();
  const encodedData = searchParams.get("data");
  const [loading, setLoading] = useState(true);
  const { email, repo, org, name } = JSON.parse(atob(encodedData));
  const router = useRouter();
  const [feedback, setFeedback] = useState();
  const [feedbackText, setFeedbackText] = useState("");

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getFeedback(email, repo, org);
      console.log(response);
      setFeedback(response);
      setFeedbackText(response.feedback);
    } catch (error) {
      console.error("Error:", error);
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFeedback = async () => {
    try {
      setLoading(true);
      const res = await patchFeedback(email, repo, feedbackText);
      console.log(res);
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

  const options = useMemo(
    () => ({
      spellChecker: false,
      placeholder: "Escribe la retroalimentación en Markdown...",
      minHeight: "200px",
      maxHeight: "300px", // Aplica solo al editor
      autosave: {
        enabled: true,
        delay: 1000,
        uniqueId: "editor_feedback",
      },
    }),
    []
  );

  useEffect(() => {
    getData();
  }, []);

  const handleSave = () => {
    updateFeedback();
    router.back();
  };

  return (
    <div
      className="bg-background w-full min-h-screen lg:px-20 py-6 flex flex-col gap-1 md:grid md:grid-cols-2 md:grid-rows-[auto_auto_1fr] 
    md:gap-4 mx-auto "
    >
      {/* Div 1: Cabecera */}
      <div className="order-1 md:col-span-2 p-4 text-center">
        <h1 className="font-semibold text-[20px] md:text-[26px] lg:text-[32px] leading-[24px] max-w-[250px] md:max-w-[382px] mx-auto font-[Bitter]">
          {name || "@UserGitHub"}
        </h1>
        <p className="text-[18px] md:text-[20px] leading-[13px] font-light text-center text-gray-500 max-w-[275px] md:max-w-[382px] mt-2 font-[Bitter] lg:mt-6 mx-auto">
          Edita la retroalimentación aqui
        </p>
      </div>

      {loading ? (
        <div className="order-2 md:order-2 col-span-2 ">
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
          <div className="order-3 md:order-3 flex justify-center md:justify-end items-center h-full p-4 lg:p-0">
            <div className="flex gap-4 md:gap-0 md:flex-col md:items-end md:space-y-[10px]">
              <button
                onClick={() => handleSave()}
                className="w-full max-w-[300px] flex items-center justify-center gap-2 font-semibold bg-secondary lg:text-[16px] text-white hover:text-white px-14 md:px-5 py-2 rounded-[8px] shadow-md hover:bg-primary-hover transition-all"
              >
                <span className="md:flex lg:flex hidden">Guardar cambios</span>
                <FaSave className="flex md:hidden" />
              </button>
              <button
                onClick={() => router.back()}
                className="w-full max-w-[300px] flex items-center justify-center gap-2 font-semibold bg-secondary lg:text-[16px] text-white hover:text-white px-14 md:px-5 py-2 rounded-[8px] shadow-md hover:bg-primary-hover transition-all"
              >
                <span className="md:flex lg:flex hidden">Cancelar</span>
                <FaTimes className="flex md:hidden" />
              </button>
            </div>
          </div>

          {/* Div 4 Retroalimentación */}
          <div className="order-4 md:col-span-2 md:order-4">
            <SimpleMDE
              value={feedbackText}
              onChange={(value) => setFeedbackText(value)}
              options={options}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default editar;
