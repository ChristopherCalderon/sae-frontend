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

export const postConnection = async (ltiData, task, classroom, org, url) => {
  const payload = {
    "idTaskGithubClassroom": task,
    "idClassroom": classroom,
    "orgId": org,
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