import axios from "axios";
import { getSession } from "next-auth/react";

export const apiClient = async () => {
  const session = await getSession();
  const token = session?.accessToken;
  

  if (!token) throw new Error("No hay accessToken disponible");

  const instance = axios.create({
    baseURL: "https://sae-backend-n9d3.onrender.com",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return instance;
};

export const getClasses = async (orgId) => {

  const client = await apiClient();
  try {
    const res = await client.get(`/repo/classrooms?orgId=${orgId}`);
    if (res.status === 200) {
      console.log(res.data);
      return res.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAssignments = async (id) => {
  const client = await apiClient();
  try {
    const res = await client.get(`/repo/classrooms/${id}/assignments`);
    if (res.status === 200) {
      console.log(res.data);
      return res.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAssignmentConfig = async (id) => {
  const client = await apiClient();
  try {
    console.log(id);
    const res = await client.get(`/task-config/${id}`);
    if (res.status === 200) {
      console.log(res.data);
      return res.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getFeedback = async (email, repo) => {
  const client = await apiClient();
  try {
    // Peticion inicial para obtener el feedback y repositorio
    const res = await client.get(
      `/feedback/search?email=${email}&idTaskGithubClassroom=${repo}`
    );

    if (res.status !== 200) {
      return [];
    }
    console.log(res.data.repo);
    const workflowRes = await client.get(
      `/repo/${res.data.repo}/workflow/details`
    );
    const statusRes = await client.get(`/feedback/status/${res.data.repo}`);

    const workflow = workflowRes.data.data;
    const status = statusRes.data;

    console.log(status);

    return {
      ...res.data,
      feedback_status: status.status || null,
      workflow_name: workflow.workflow_name || null,
      workflow_status: workflow.status || null,
      workflow_conclusion: workflow.conclusion || null,
      workflow_url: workflow.run_url || null,
    };
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getSubmissions = async (id) => {
  const client = await apiClient();
  try {
    const res = await client.get(
      `/repo/assignments/${id}/accepted_assignments`
    );

    if (res.status !== 200) {
      return [];
    }

    console.log(res.data.data);
    // Mapear cada submission para añadir el email
    const submissionsWithEmails = await Promise.all(
      res.data.data.map(async (submission) => {
        try {
          // Petición para obtener el email de cada usuario
          const emailRes = await client.get(
            `/user/students/${submission.students[0].login}/email`
          );

          // Petición para obtener el estado de feedback de cada usuario
          const statusRes = await client.get(
            `/feedback/status/${submission.repository.name}`
          );

          return {
            ...submission,
            email: emailRes.data.email || null,
            feedback_status: statusRes.data.status || null,
          };
        } catch (error) {
          console.error(
            `Error obteniendo email para usuario ${submission.students[0].login}:`,
            error
          );
          return {
            ...submission,
            email: null,
          };
        }
      })
    );

    return submissionsWithEmails;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getRepoData = async (repo) => {
  const client = await apiClient();
  try {
    const res = await client.get(`/repo/${repo}/files?ext=.cpp`);
    if (res.status === 200) {
      return res.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};



export const postFeedback = async (repo, repoData) => {

  
  console.log(repo.repository.name)
  console.log(repo.assignment.id)
  const [value, total] = repo.grade.split('/').map(Number);
  const payload = {
    readme: repoData.readme,
    code: repoData.code,
    gradeValue: value,
    gradeTotal: total,
    modelIA: "gemini",
    email: repo.email,
    idTaskGithubClassroom: repo.assignment.id,
    language: "C++",
    subject: "Estructuras Dinámicas",
    studentLevel: "Universitario - Segundo Año",
    topics: "condicionales y loops",
    constraints: "No usar librerías externas",
    style: "Google C++ Style Guide",
  };
  try {
    const res = await axios.post(
      `https://sae-backend-n9d3.onrender.com/feedback/${repo.repository.name}/gemini`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (res.status === 201) {
      console.log(res);
      return res.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error)
  }
};

export const patchFeedback = async (email, id , feedback) => {
  const client = await apiClient();
  try {
    const res = await client.patch((`/feedback/update?email=${email}&idTaskGithubClassroom=${id}`), {
      feedback: feedback
    },
      {
        headers: {
          'Content-Type' : 'application/json'
        }
      }
    )
    if (res.status === 200) {
      console.log(res);
      return res;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error)
  }
}

export const postPullRequest = async (repo, feedbackText) => {
  const client = await apiClient();
  try {
    const res = await client.post((`/repo/${repo}/pr/feedback`), {
      feedback: feedbackText
    },
      {
        headers: {
          'Content-Type' : 'application/json'
        }
      }
    )
    if (res.status === 200) {
      console.log(res);
      return res;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error)
  }
}

export const createUserData = async (username) => {
  const client = await apiClient();
  try {
    const res = await client.post((`/user/first-login?username=${username}`),
      {
        headers: {
          'Content-Type' : 'application/json'
        }
      }
    )
    if (res.status === 200) {
      console.log(res);
      return res;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error)
  }
}

export const getModelProviders = async() => {
  const client = await apiClient();
  try {
    const res = await client.get('/model-types/all')
    if (res.status = 200){
      console.log(res.data.modelTypes)
      return res.data.modelTypes
    }
    else{
      return []
    }
  } catch (error) {
    
  }
}
export const getOrgModels = async(id) => {
  const client = await apiClient();
  try {
    const res = await client.get(`/model-types/org-models?orgId=${id}`)
    if (res.status = 200){
      return res.data.models
    }
    else{
      return []
    }
  } catch (error) {
    
  }
}

export const createOrgModel = async(provider, model, name, key, org) => {
  const client = await apiClient();
  const payload = {
    "name": name,
    "version": model,
    "apiKey": key, 
    "modelType": provider,
    "orgId": org
  }
  console.log(payload)
  try {
    const res = await client.post(('/model-types/create'),payload,{
      headers: {
        'Content-Type': 'application/json'
      }}
    )
    if (res.status = 200){
      console.log(res.data.modelTypes)
      return res.data.modelTypes
    }
    else{
      return []
    }
  } catch (error) {
    
  }
}