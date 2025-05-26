"use client";
import React, { useEffect, useState } from "react";
import { MdOutlineTask } from "react-icons/md";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { decodeToken } from "@/services/ltiService";
import Loading from "@/components/loader/Loading";
import { FaClipboardCheck, FaFileCircleCheck, FaSquareCheck } from "react-icons/fa6";
import { FaRegCheckSquare } from "react-icons/fa";

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
    <div className="bg-background h-screen flex flex-col items-center justify-center gap-5 w-full p-4 lg:p-8 shadow-[0px_8px_8px_rgba(0,0,0,0.25)]">
      <div
        className="w-full md:w-2/3 h-1/2 md:h-2/3 bg-white shadow-xl text-primary font-medium px-3 py-5 gap-3 rounded-md flex flex-col 
    justify-center items-center text-lg"
      >
        {loading ? (
          <Loading />
        ) : (
          <div className="gap-3 p-5 w-full  flex flex-col  justify-center items-center">
            <FaRegCheckSquare className="text-8xl text-secondary" />
            <h1 className="font-bold">
              Hola {data.name}
            </h1>
            <p className="text-center">Tu enlace de invitación es el siguiente: </p>
            <p className="w-full text-center">
              <a
                href={data.urlInvitation}
                className="underline w-full hover:font-bold text-[#2768F5]  break-words whitespace-normal"
              >
                {data.urlInvitation}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvitationCard;
