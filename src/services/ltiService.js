import axios from "axios";

export const decodeToken = async (token) => {
  try {
    const res = await axios.get(
      `https://sae-backend-n9d3.onrender.com/jwt/decode`,
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
    const res = await axios.post('https://sae-backend-n9d3.onrender.com/task-link/create', payload , {
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
    const res = await axios.get(`https://sae-backend-n9d3.onrender.com/task-link/github-tasks?idClassroom=${classroom}`)

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