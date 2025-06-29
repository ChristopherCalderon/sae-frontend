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

//Clases------------------------------------------------------
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

//Tareas------------------------------------------------------
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

//Feedback------------------------------------------------------
export const getFeedback = async (email, repo, org) => {
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
    // Petición para obtener detalles del workflow
    let workflow = {};
    try {
      const workflowRes = await client.get(
        `/repo/${res.data.repo}/workflow/details?orgName=${org}`
      );
      workflow = workflowRes.data?.data || {};
    } catch (workflowError) {
      console.warn("No se pudo obtener el workflow:", workflowError);
      workflow = {};
    }


    const statusRes = await client.get(`/feedback/status/${res.data.repo}`);


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

export const getStudentFeedback = async (email, repo) => {
  try {
    // Peticion inicial para obtener el feedback y repositorio
    const res = await axios.get(
      `${baseURL}feedback/search?email=${email}&idTaskGithubClassroom=${repo}`
    );

    if (res.status !== 200) {
      return [];
    }

    return res.data;
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

          let gradeFeedback = 0;

          let grade_test = 0;
          console.log(submission)
          if (submission && submission.grade) {
            grade_test = parseInt(submission.grade.split("/")[0]);
          }
          try {
            // Petición para obtener nota de feedback
            const gradeRes = await client.get(
              `/feedback/gradeFeedback/${submission.repository.name}`
            );
            gradeFeedback = gradeRes.data.gradeFeedback || 0;
          } catch (gradeError) {
            if (gradeError.response && gradeError.response.status === 404) {
              gradeFeedback = 0; // Manejo específico para 404
            } else {
              console.error(
                `Error obteniendo gradeFeedback para ${submission.repository.name}:`,
                gradeError
              );
            }
          }

          return {
            ...submission,
            email: emailRes.data.email || null,
            feedback_status: statusRes.data.status || null,
            grade_feedback: gradeFeedback,

            grade_test: grade_test,
          };
        } catch (error) {
          console.error(
            `Error obteniendo email para usuario ${submission.students[0].login}:`,
            error
          );
          return {
            ...submission,
            email: null,
            feedback_status: null,
            grade_feedback: 0,
            grade_test: grade_test,
          };
        }
      })
    );

    return submissionsWithEmails;
  } catch (error) {
    console.error("Error en getSubmissions:", error);
    return [];
  }
};

export const getRepoData = async (repo, org, extension) => {
  const client = await apiClient();
  try {
    const res = await client.get(
      `/repo/${repo}/files?orgName=${org}&ext=${extension}`
    );
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

export const postFeedback = async (repo, repoData, config, teacher) => {
  const client = await apiClient();
  const [value, total] = repo.grade.split("/").map(Number);
  const payload = {
    readme: repoData.readme,
    code: repoData.code,
    gradeValue: value,
    gradeTotal: total,
    email: repo.email,
    idTaskGithubClassroom: repo.assignment.id,
    language: config.language,
    topics: config.topic,
    studentLevel: config.studentLevel,
    constraints: config.constraints,
    style: config.style,
    modelId: config.modelIA,
    reviewedBy: teacher,
  };

  console.log(payload);

  const modelProvider = config.providerNameIA?.toLowerCase();
  try {
    const res = await client.post(
      `/feedback/${repo.repository.name}/${modelProvider}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 201) {
      console.log(res);
      return res.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};

export const postFeedbackStatus = async (id, length, pendientes, generados, enviados) => {
  const client = await apiClient();
  const payload = {
    idTaskGithubClassroom: id, 
    countEntregas: length, 
    countPendiente: pendientes, 
    countGenerado: generados, 
    countEnviado: enviados
  };

  console.log(payload);

  try {
    const res = await client.post(
      `/task/feedback-status`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 201) {
      console.log(res);
      return res.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};
export const generateFeedback = async (repo, repoData, config, teacher) => {
  const client = await apiClient();

  let [value, total] = [0, 10];

  if (repo && repo.grade) {
    [value, total] = repo.grade.split("/").map(Number);
  }

  const payload = {
    readme: repoData.readme,
    code: repoData.code,
    gradeValue: value,
    gradeTotal: total,
    email: repo.email,
    idTaskGithubClassroom: repo.assignment.id,
    language: config.language,
    topics: config.topic,
    studentLevel: config.studentLevel,
    constraints: config.constraints,
    style: config.style,
    modelId: config.modelIA,
    reviewedBy: teacher,
  };

  console.log(payload);

  try {
    const res = await client.post(
      `feedback/generate/${repo.repository.name}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 201) {
      console.log(res);
      return res.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};

export const patchFeedback = async (email, id, feedback) => {
  const client = await apiClient();
  try {
    const res = await client.patch(
      `/feedback/update?email=${email}&idTaskGithubClassroom=${id}`,
      {
        feedback: feedback,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      console.log(res);
      return res;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};

export const postPullRequest = async (repo, feedbackText, org) => {
  const client = await apiClient();
  try {
    const res = await client.post(
      `/repo/${repo}/pr/feedback?orgName=${org}`,
      {
        feedback: feedbackText,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      console.log(res);
      return res;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteFeedback = async (email, id) => {
  const client = await apiClient();
  try {
    const res = await client.delete(
      `/feedback/delete?email=${email}&idTaskGithubClassroom=${id}`
    );
    if ((res.status = 200)) {
      return res.data.models;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error.message);
  }
};

//Login------------------------------------------------------
export const createUserData = async (username) => {
  const client = await apiClient();
  try {
    const res = await client.post(`/user/first-login?username=${username}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      console.log(res);
      return res;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};

//Modelos------------------------------------------------------
export const getModelProviders = async () => {
  const client = await apiClient();
  try {
    const res = await client.get("/model-types/all");
    if ((res.status = 200)) {
      console.log(res.data.modelTypes);
      return res.data.modelTypes;
    } else {
      return [];
    }
  } catch (error) {}
};
export const getOrgModels = async (id) => {
  const client = await apiClient();
  try {
    const res = await client.get(`/model-types/org-models?orgId=${id}`);
    if ((res.status = 200)) {
      return res.data.models;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const createOrgModel = async (provider, model, name, key, org) => {
  const client = await apiClient();
  const payload = {
    name: name,
    version: model,
    apiKey: key,
    modelType: provider,
    orgId: org,
  };
  console.log(payload);
  try {
    const res = await client.post("/model-types/create", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if ((res.status = 200)) {
      console.log(res.data.modelTypes);
      return res.data.modelTypes;
    } else {
      return [];
    }
  } catch (error) {}
};

export const createTeacherModel = async (provider, model, name, key, email) => {
  const client = await apiClient();
  const payload = {
    name: name,
    version: model,
    apiKey: key,
    modelType: provider,
    ownerEmail: email,
  };
  console.log(payload);
  try {
    const res = await client.post("/model-types/create", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if ((res.status = 200)) {
      console.log(res.data.modelTypes);
      return res.data.modelTypes;
    } else {
      return [];
    }
  } catch (error) {}
};

export const deleteOrgModel = async (id) => {
  const client = await apiClient();
  try {
    const res = await client.delete(`/model-types/delete/${id}`);
    if ((res.status = 200)) {
      return res.data.models;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getTeachers = async (id) => {
  const client = await apiClient();
  try {
    const res = await client.get(`/user/teachers?orgId=${id}`);
    if ((res.status = 200)) {
      return res.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getOneTeacher = async () => {
  const client = await apiClient();
  try {
    const res = await client.get(`/user/teacher/chris2001289@gmail.com`);
    if ((res.status = 200)) {
      console.log(res.data);
      return res.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getTeacherModels = async (email, org) => {
  const client = await apiClient();
  try {
    const res = await client.get(
      `/model-types/models-for-teacher?email=${email}&orgId=${org} `
    );
    if ((res.status = 200)) {
      console.log(res.data);
      return res.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const patchTeacherModels = async (model, email, org) => {
  const client = await apiClient();
  try {
    const res = await client.patch(
      `/model-types/add-teacher?modelId=${model}&email=${email}&orgId=${org}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      console.log(res);
      return res;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteAsignedModel = async (model, email, org) => {
  const client = await apiClient();
  try {
    const res = await client.patch(
      `/model-types/remove-teacher?modelId=${model}&email=${email}&orgId=${org}`
    );
    if ((res.status = 200)) {
      return res.data.models;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error.message);
  }
};

//Configuracion de tarea------------------------------------------------------
export const getTaskConfig = async (id) => {
  const client = await apiClient();
  try {
    const res = await client.get(`/task-config/${id}`);

    if (res.status === 200) {
      return res;
    }

    return undefined;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return undefined;
    }

    console.log(error);
    throw error;
  }
};

export const createTaskConfig = async (id, body) => {
  const client = await apiClient();
  const payload = {
    language: body.language,
    extension: body.extension,
    studentLevel: body.studentLevel,
    style: body.style,
    topic: body.topic,
    constraints: body.constraints,
    modelIA: body.modelIA,
    providerNameIA: body.providerNameIA,
    idTaskGithubClassroom: id,
  };
  try {
    const res = await client.post(`/task-config/create`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if ((res.status = 200)) {
      return res;
    }
    return [];
  } catch (error) {
    console.log(error);
  }
};

export const updateTaskConfig = async (id, body) => {
  const client = await apiClient();
  const payload = {
    language: body.language,
    extension: body.extension,
    studentLevel: body.studentLevel,
    style: body.style,
    topic: body.topic,
    constraints: body.constraints,
    modelIA: body.modelIA,
    providerNameIA: body.providerNameIA,
  };
  try {
    const res = await client.put(`/task-config/${id}`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if ((res.status = 200)) {
      return res;
    }
    return [];
  } catch (error) {
    console.log(error);
  }
};

//Administrador

export const getOrganizations = async () => {
  const client = await apiClient();
  try {
    const res = await client.get(`/user/organizations`);
    if ((res.status = 200)) {
      console.log(res.data);
      return res.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};

export const toggleOrganization = async (orgId, isActive) => {
  const client = await apiClient();
  try {
    if (isActive) {
      const res = await client.patch(`/user/deactivate-users/${orgId}`);
      if ((res.status = 200)) {
        console.log(res.data);
        return res.data;
      } else {
        return [];
      }
    } else {
      const res = await client.patch(`/user/activate-users/${orgId}`);
      if ((res.status = 200)) {
        console.log(res.data);
        return res.data;
      } else {
        return [];
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const getOrgUsers = async () => {
  const client = await apiClient();
  try {
    const res = await client.get(`/user/by-org`);
    if ((res.status = 200)) {
      console.log(res.data);
      return res.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateOrgAdmin = async (org, user) => {
  const client = await apiClient();
  try {
    const res = await client.patch(
      `/user/assign-org-admin?userId=${user}&orgId=${org}`
    );

    if ((res.status = 200)) {
      return res;
    }
    return [];
  } catch (error) {
    console.log(error);
  }
};

export const updateUserStatus = async (org, user, status) => {
  const client = await apiClient();
  try {
    const res = await client.patch(
      `/user/status?userId=${user}&orgId=${org}&activate=${status}`
    );

    if ((res.status = 200)) {
      return res;
    }
    return [];
  } catch (error) {
    console.log(error);
  }
};

//Proveedores------------------------------------------------------

export const getModelByProvider = async (id) => {
  const client = await apiClient();
  try {
    const res = await client.get(`/model-types/providers/${id}/models`);
    if ((res.status = 200)) {
      console.log(res.data);
      return res.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};

export const addModelProvider = async (id, name) => {
  const client = await apiClient();
  const payload = {
    modelName: name,
  };
  try {
    const res = await client.post(
      `/model-types/providers/${id}/add-model`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if ((res.status = 200)) {
      return res;
    }
    return [];
  } catch (error) {
    console.log(error);
  }
};
