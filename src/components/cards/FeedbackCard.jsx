"use client";
import Loading from "@/components/loader/Loading";
import { getStudentFeedback } from "@/services/githubService";
import { decodeToken } from "@/services/ltiService";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";

function FeedbackCard() {
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState();
  const [name, setName] = useState();
  const router = useRouter();

  const searchParams = useSearchParams();
  const encodedData = searchParams.get("token");

  const getData = async () => {
    if (!encodedData) {
      router.push("/");
      return;
    }
    try {
      setLoading(true);
      const decodedRes = await decodeToken(encodedData);

      const response = await getStudentFeedback(
        decodedRes.email,
        decodedRes.idTaskClassroom.idTaskGithubClassroom
      );

      setName(decodedRes.name);
      setFeedback(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="bg-background flex flex-col gap-5 w-full h-screen p-8 overflow-clip">
      <div className="w-ful text-primary flex items-center justify-between ">
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          {loading ? <p>Cargando...</p> : <h1>Retroalimentacion</h1>}
        </div>
      </div>
      <div className="w-full h-[90%] flex flex-col gap-4 bg-white shadow-xl overflow-clip px-5 py-5 rounded-md text-primary text-sm">
        {loading ? (
          <Loading />
        ) : (
          <div className="w-full h-full flex flex-col gap-2">
            {/* Contenedor de informacion */}
            <div className="flex flex-col md:flex-row w-full md:justify-between py-2">
              {/* Informacion de retroalimentacion */}
              <div className="flex flex-col">
                <span className="font-bold flex gap-1">
                  Email: <p className="font-normal">{feedback.email}</p>
                </span>

                <span className="font-bold flex gap-1">
                  Repositorio: <p className="font-normal">{feedback.repo}</p>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="flex gap-5 font-medium">
                  <p>
                    Nota de Test:{" "}
                    <a className=" font-semibold">
                      {feedback.gradeValue} / {feedback.gradeTotal}
                    </a>
                  </p>
                </span>
                <span className="flex gap-5 font-medium">
                  <p>
                    Nota de Retroalimentacion:{" "}
                    <a className=" font-semibold">
                      {feedback.gradeFeedback} / {feedback.gradeTotal}
                    </a>
                  </p>
                </span>
              </div>
            </div>

            {/* Contenedor de feedback */}
            <div
              className="w-full h-[90%] p-5 rounded-md shadow-md overflow-y-scroll bg-background   [&::-webkit-scrollbar]:w-1
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

export default FeedbackCard;
