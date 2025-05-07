"use client";
import {
  getAssignmentConfig,
  getFeedback,
  getRepoData,
  postFeedback,
} from "@/services/githubService";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Loading from "../loader/Loading";

function getFeedbackColor(status) {
  if (status === "sent") return "text-accent";
  if (status === "Pendiente") return "text-[#710000]";
  return "text-primary";
}

const getData = async (repoName, org, extension) => {
  try {
    const response = await getRepoData(repoName, org, extension);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const getConfig = async (id) => {
  try {
    const response = await getAssignmentConfig(id);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const generateOne = async (
  repo,
  id,
  setLoading,
  setSuccessMessage,
  getFeedbacks,
  config,
  org
) => {
  setLoading(true);
  try {
    console.log(config)
    const repoData = await getData(repo.repository.name, org, config.extension);
    await postFeedback(repo, repoData,config);
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

const generateAll = (repos) => {
  repos.array.forEach((repo) => {
    generateOne(repo, id, setLoading, setSuccessMessage, getFeedback);
  });
};

function AssignmentsTable({ submissions, id, getFeedbacks, config, org }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  console.log(submissions)
  console.log(id)
  console.log(config)
  console.log(org)

  return (
    <div className="relative p-4 overflow-x-auto">
      {/* Modal loader */}
      {loading && (
        <div className="absolute inset-0 bg-black/40 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <Loading />
            <p className="text-sm font-semibold">
              Generando retroalimentación...
            </p>
          </div>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="absolute inset-0 bg-black/40 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded shadow-md text-center">
            {successMessage}
          </div>
        </div>
      )}

      <table className="min-w-full text-sm border border-gray-300 rounded-md shadow-md">
        <thead className="bg-secondary text-left">
          <tr>
            <th className="px-4 py-2">Usuario</th>
            <th className="px-4 py-2">Correo Electrónico</th>
            <th className="px-4 py-2">Commits</th>
            <th className="px-4 py-2">Calificación</th>
            <th className="px-4 py-2">Retroalimentación</th>
            <th className="px-4 py-2">Repositorio</th>
            <th className="px-4 py-2">URL</th>
            <th className="px-4 py-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((u, i) => (
            <tr key={i} className="border-t">
              <td className="px-3 py-2">@{u.students[0].login}</td>
              <td className="px-2 py-2">{u.email}</td>
              <td className="px-2 py-2 text-center">{u.commit_count}</td>
              <td className="px-2 py-2 text-center">{u.grade}</td>
              <td
                className={`px-2 py-2 font-semibold text-center ${getFeedbackColor(
                  u.feedback_status
                )}`}
              >
                  <p>{u.feedback_status}</p>
              </td>
              <td className="px-2 py-2">{u.repository.name}</td>
              <td className="px-1 py-2 text-blue-500 text-xs">
                {u.repository.html_url}
              </td>
              <td className="px-2 py-2">
                {u.feedback_status === "Pendiente" ? (
                  <button
                    onClick={() =>
                      generateOne(
                        u,
                        id,
                        setLoading,
                        setSuccessMessage,
                        getFeedbacks,
                        config,
                        org
                      )
                    }
                    className="bg-secondary hover:bg-primary hover:text-white text-primary font-bold text-xs px-3 py-1 rounded"
                  >
                    Generar
                  </button>
                ) : u.feedback_status === "Generado"  || u.feedback_status === "sent" ? (
                  <Link
                    href={{
                      pathname: `${pathname}/${u.id}`,
                      query: {
                        data: btoa(
                          JSON.stringify({
                            email: u.email,
                            repo: u.assignment.id,
                            org: org
                          })
                        ),
                      },
                    }}
                    className="bg-secondary hover:bg-primary hover:text-white text-primary font-bold text-xs px-3 py-1 rounded"
                  >
                    Ver
                  </Link>
                ): ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssignmentsTable;
