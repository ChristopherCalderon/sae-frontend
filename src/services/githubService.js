
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


export const getClasses = async () => {
  const client = await apiClient();
  try {
    const res = await client.get("/repo/classrooms");
    if(res.status === 200){
      console.log(res.data)
      return res.data
    }else{
      return [];
    }
    
  } catch (error) {
    console.log(error)
    return [];
  }
};
