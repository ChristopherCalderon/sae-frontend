"use client";
import React, { useEffect, useState } from "react";
import { MdOutlineTask } from "react-icons/md";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { decodeToken } from "@/services/ltiService";
import Loading from "@/components/loader/Loading";

function InvitationCard() {
  const searchParams = useSearchParams();
  const encodedData = searchParams.get("token");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  console.log(encodedData);

  const getData = async () => {
    if (!encodedData) {
      router.push("/");
      return;
    }
    try {
      setLoading(true);
      const decodedRes = await decodeToken(encodedData);

      setData(decodedRes);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="bg-background h-screen flex flex-col gap-5 w-full p-8 overflow-clip">
      <div className="w-full text-primary">
        <h1 className="text-2xl font-bold">Invitacion</h1>
      </div>
      <div
        className="w-full h-[90%]  bg-white shadow-xl text-primary font-medium px-3 py-5 gap-3 rounded-md flex flex-col 
    justify-center items-center text-lg"
      >
        {loading ? (
          <Loading />
        ) : (
          <div className="gap-3  flex flex-col  justify-center items-center">
            <MdOutlineTask className="text-8xl" />
            <h1>
              Hola <a className="font-bold"> {data.name}</a> tu enlace de
              invitacion es el siguiente:
            </h1>
            <p>Si ya generaste tu repositorio, puedes ignorar este mensaje</p>
            <p>
              Tu catedratico se encuentra realizando las retroalimentaciones
              respectivas
            </p>
            <p>
              Enlace de invitacion:{" "}
              <a
                href={data.urlInvitation}
                className="underline hover:font-bold"
              >
                {data.urlInvitation}
              </a>{" "}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvitationCard;
