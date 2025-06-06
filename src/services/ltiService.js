import axios from "axios";
import { getSession } from "next-auth/react";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL; 

export const apiClient = async () => {
  const session = await getSession();
  const token = session?.accessToken;

  if (!token) throw new Error("No hay accessToken disponible");
  if (!baseURL) throw new Error("API base URL no definida");
  const instance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return instance;
};

export const decodeToken = async (token) => {
  try {
    const res = await axios.get(
      `${baseURL}jwt/decode`,
      {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      console.log(res.data.data);
      return res.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};

export const postConnection = async (ltiData, task, classroom, orgId, orgName, url) => {
  const client = await apiClient();

  const payload = {
    "idTaskGithubClassroom": task,
    "idClassroom": classroom,
    "orgId": orgId,
    "orgName": orgName,
    "url_Invitation": url,
    "emailOwner": ltiData.email,
    "idTaskMoodle": ltiData.assignmentId,
    "idCursoMoodle": ltiData.courseId,
    "issuer": ltiData.issuer
  }
  console.log(payload)
  try {
    const res = await client.post('/task-link/create', payload , {
      headers: {
          "Content-Type": "application/json",
      },
    } )

    if (res.status === 201) {
      console.log(res);
      return res.data;
    } else {
      return [];
    }
    
  } catch (error) {
    console.log(error)
  }
}

export const postGrades = async (id, issuer) => {
  const client = await apiClient();

  const payload = {
    "assignmentId": "6",
    "issuer": "https://ecampusuca.moodlecloud.com"

  }
  console.log(payload)
  try {
    const res = await client.post('/send-grades', payload , {
      headers: {
          "Content-Type": "application/json",
      },
    } )

    if (res.status === 201) {
      console.log(res);
      return res.data;
    } else {
      return [];
    }
    
  } catch (error) {
    console.log(error)
  }
}

export const getLinkedTasks = async (classroom) => {
  try {
    const client = await apiClient();
    const res = await client.get(`/task-link/github-tasks?idClassroom=${classroom}`)

    if (res.status === 200) {
      console.log(res);
      return res.data;
    } else {
      return [];
    }
  } catch (error) {
        if (error.response && error.response.status === 404) {
      // No se encontraron tareas linkeadas
      return [];
    }
    console.log(error)
  }
}