"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getFeedback, postPullRequest } from "@/services/githubService";
import { useEffect, useState } from "react";
import Loading from "@/components/loader/Loading";

//const markdownText = await fetch('/markdown.md');

function entrega() {
  const searchParams = useSearchParams();
  const encodedData = searchParams.get("data");
  const { email, repo } = JSON.parse(atob(encodedData));
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState();
  const [markdownContent, setMarkdownContent] = useState("");

  const getData = async () => {
    try {
      setLoading(true);
      const responseMd = await fetch("/markdown.txt");
      const text = await responseMd.text();
      const response = await getFeedback(email, repo);
      console.log(response);
      setMarkdownContent(text);
      setFeedback(response);
    } catch (error) {
      console.error("Error:", error);
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  const createPullRequest = async () => {
    try {
      await postPullRequest(feedback.repo, feedback.feedback)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const pathname = usePathname();
  return (
    <div className="bg-background flex flex-col gap-5 w-full h-full p-8 overflow-clip">
      <div className="w-full text-primary flex items-center justify-between ">
        <div>
          <h1 className="text-2xl font-bold">@UserGithub</h1>
          <p className="font-semibold">Nombre de tarea</p>
        </div>
      </div>
      <div className="w-full h-[90%] flex flex-col gap-4 bg-white shadow-xl overflow-clip px-5 py-5 rounded-md text-primary text-sm">
        {loading ? (
          <Loading />
        ) : (
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
              <div className="flex flex-col gap-1 justify-center">
                <Link
                  href={`${pathname}/editar`}
                  className="flex items-center justify-center gap-2 font-semibold bg-primary text-white hover:text-white px-5 hover:bg-primary-hover py-2 rounded shadow-lg"
                >
                  Editar retroalimentacion
                </Link>
                {feedback.feedback_status == "generated" && (
                  <button onClick={() => createPullRequest()} 
                  className="flex items-center justify-center gap-2 font-semibold bg-primary text-white hover:text-white px-5 hover:bg-primary-hover py-2 rounded shadow-lg">
                    Agregar pull request
                  </button>
                )}

                <button className="flex items-center justify-center gap-2 font-semibold bg-primary text-white hover:text-white px-5 hover:bg-primary-hover py-2 rounded shadow-lg">
                  Volver a generar
                </button>
              </div>
            </div>

            {/* Contenedor de feedback */}
            <div
              className="w-full h-3/4 p-5 rounded-md shadow-md overflow-y-scroll bg-background   [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-background
        [&::-webkit-scrollbar-thumb]:bg-primary"
            >
              <ReactMarkdown>{feedback.feedback}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default entrega;
