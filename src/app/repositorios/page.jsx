"use client";
import ExcelButton from "@/components/buttons/ExcelButon";
import Loading from "@/components/loader/Loading";
import { signIn, signOut, useSession } from "next-auth/react";
import AssignmentsTable from "@/components/tables/AssignmentsTable";
import { FaGithub } from "react-icons/fa";
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

function repositorios() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState();
  const [data, setData] = useState();
  const [generated, setGenerated] = useState(false)
  const router = useRouter();
  const { id } = useParams();
  const { data: session, status } = useSession();

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
      await postGrades(5, 'a')
    } catch (error) {
      console.log(error)
    }
  }

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

  const handleSignIn = async () => {
    await signIn("github");
  };

  useEffect(() => {
    if (!token) {
      router.push("/");
    } else if (token && status === "authenticated") {
      getData();
    } else {
      setLoading(false);
    }
  }, [token, status]);

  return (
    <div className="bg-background flex flex-col gap-5 w-full h-screen p-8 overflow-clip">
      <div className="w-full text-primary flex items-center justify-between ">
        <div>
          <h1 className="text-2xl font-bold">Tarea de programación</h1>
          <p className="font-semibold">
            Vista general de los repositorios de los alumnos incritos en el
            curso
          </p>
        </div>
        {status === "unauthenticated" ? (
          <div className="flex gap-3">
            <button
              onClick={handleSignIn}
              className="font-mono font-normal bg-black text-[13px] text-white flex items-center justify-center px-4 py-2 rounded-md 
                                      shadow hover:bg-gray-800 transition"
            >
              <FaGithub className="mr-2" />
              Login with GitHub
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => generateFeedback()}
              className="flex items-center justify-center gap-2 font-semibold bg-secondary text-primary hover:text-white px-5 hover:bg-primary py-1 rounded shadow-lg"
            >
              <RiAiGenerate2 className="text-xl" />
              Generar retroalimentacion
            </button>
            <button
              onClick={() => sendGrades()}
              className="flex items-center justify-center gap-2 font-semibold bg-secondary text-primary hover:text-white px-5 hover:bg-primary py-1 rounded shadow-lg"
            >
              <RiAiGenerate2 className="text-xl" />
              Enviar notas
            </button>
            <ExcelButton data={submissions} />
            <a
  href="https://sae-lti.onrender.com/login?purpose=sendgrades&iss=https://ecampusuca.moodlecloud.com&client_id=d8Af3rpbiUdOneX&target_link_uri=https://sae-lti.onrender.com/"
  target="_blank"
  rel="noopener noreferrer"
>
  <button className="btn btn-success">Enviar notas a Moodle</button>
</a>
          </div>
        )}
      </div>
      <div
        className="w-full h-[90%] bg-white shadow-xl px-3 py-5 gap-3 overflow-y-scroll [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-white
        [&::-webkit-scrollbar-thumb]:bg-primary rounded-md"
      >
        {loading ? (
          <Loading />
        ) : submissions.length === 0 && status === "authenticated" ? (
          <h1>No se encontraron entregas</h1>
        ) : status === "authenticated" ? (
          <AssignmentsTable
            submissions={submissions}
            id={data.idtaskgithub}
            getFeedbacks={getData}
            config={config}
            org={data.orgName}
          />
        ) : status === "unauthenticated" ? (
          <p>Debes iniciar sesion para ver los repositorios</p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default repositorios;
