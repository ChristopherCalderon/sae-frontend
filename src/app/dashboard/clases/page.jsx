'use client';
import { useSession, getSession } from "next-auth/react"
import { useRouter } from 'next/navigation';
import ClassCard from "@/components/cards/ClassCard";
import React, { useEffect } from "react";

export default function Clases() {


  return (
    <div className="bg-background flex flex-col gap-5 w-full h-full p-8 overflow-clip">
      <div className="w-full text-primary ">
        <h1 className="text-2xl font-bold">Mis Clases</h1>
        <p className="font-semibold">Vista general de los cursos</p>
      </div>
      <div className="w-full h-[90%] bg-white shadow-xl px-3 py-5 grid grid-cols-2 gap-3 overflow-y-scroll  rounded-md
      [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-white
        [&::-webkit-scrollbar-thumb]:bg-primary">
        <ClassCard />
        <ClassCard />
        <ClassCard />
        <ClassCard />
        <ClassCard />
        <ClassCard />
        <ClassCard />
        <ClassCard />
        <ClassCard />
        <ClassCard />
      </div>
    </div>
  );
}
