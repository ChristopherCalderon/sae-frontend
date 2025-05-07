"use client";
import React, { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { useRouter, useSearchParams } from "next/navigation";
import { getFeedback, patchFeedback } from "@/services/githubService";
import Loading from "@/components/loader/Loading";

function editar() {
  const searchParams = useSearchParams();
  const encodedData = searchParams.get("data");
  const [loading, setLoading] = useState(true);
  const { email, repo, org } = JSON.parse(atob(encodedData));
  const router = useRouter();
  const [feedback, setFeedback] = useState();
  const [feedbackText, setFeedbackText] = useState('');

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
      const res = await patchFeedback(email, repo, feedbackText)
      console.log(res)
      } catch (error) {
        console.log(error)
      }
    }

  useEffect(() => {
    getData();
  }, []);

  const handleSave = () => {
    updateFeedback()
    router.back()
  };

  return (
    <div className="bg-background flex flex-col gap-5 w-full h-screen p-8 overflow-clip">
      <div className="w-full text-primary flex items-center justify-between ">
        <div>
          <h1 className="text-2xl font-bold">@UserGithub</h1>
          <p className="font-semibold">Edita la retroalimentacion aqui</p>
        </div>
      </div>
      <div className="w-full h-[90%] flex flex-col gap-4 bg-white shadow-xl overflow-clip px-5 py-5 rounded-md text-primary text-sm">
        { loading? <Loading/> :
          <div className="w-full h-full">
            {/* Contenedor de informacion */}
            <div className="flex w-full justify-between">
              {/* Informacion de retroalimentacion */}
              <div className="flex flex-col">
              <h1 className="font-bold">
                  {feedback.repo}
                </h1>
                <p>Workflow: {feedback.workflow_name}</p>
                <p>Estado: {feedback.workflow_status}</p>
                <p>Conclusion: {feedback.workflow_conclusion}</p>
                <span className="flex gap-5">
                  <p>
                    Calificacion:{" "}
                    <a className="text-accent font-semibold">
                      {feedback.gradeValue} / {feedback.gradeTotal}
                    </a>
                  </p>
                  <a
                    className="flex gap-1 items-center underline hover:font-semibold"
                    href={feedback.workflow_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="text-lg" /> Ver ejecucion en github
                  </a>
                </span>
                <p>Generado con:  {feedback.modelIA}</p>
                <p>Creado en:  {feedback.createdAt}</p>
              </div>
              {/* Botones de retroalimentacion */}
              <div className="flex flex-col gap-2 justify-center">
                <button
                  onClick={() => handleSave()}
                  className="flex items-center justify-center gap-2 font-semibold bg-primary text-white hover:text-white px-8 hover:bg-primary-hover py-2 rounded shadow-lg"
                >
                  Guardar cambios
                </button>
                <button
                  onClick={() => router.back()}
                  className="flex items-center justify-center gap-2 font-semibold bg-primary text-white hover:text-white px-8 hover:bg-primary-hover py-2 rounded shadow-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>

            {/* Contenedor de feedback */}
            <div className="w-full h-3/4 rounded-md shadow-md overflow-y-clip bg-background  ">
              <textarea
                className="w-full h-full text-sm font-mono  text-primary resize-none border-none outline-none
          overflow-y-scroll [&::-webkit-scrollbar]:w-1
      [&::-webkit-scrollbar-track]:bg-background
      [&::-webkit-scrollbar-thumb]:bg-primary"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default editar;
