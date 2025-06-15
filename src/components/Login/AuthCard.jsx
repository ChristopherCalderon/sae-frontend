"use client";
import { FaGithub } from "react-icons/fa";
import { signIn, signOut, useSession } from "next-auth/react";
import GithubLoginButton from "./GithubLoginButton";
import { FaRegCopyright } from "react-icons/fa6";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AuthCard() {
  const { data: session } = useSession();

  const handleSignIn = async () => {
    await signIn("github", { callbackUrl: "/organizations" });
  };

  return (
    <div className="text-center font-primary space-y-6 w-full md:w-1/2 lg:w-1/3 flex flex-col items-center justify-center  bg-inherit px-10 py-20 rounded-lg">
      <img
        src="/logo.png"
        alt="logo"
        className=" w-56 md:w-72 lg:w-80"
      />
      <div className="w-full flex flex-col gap-2">
        
      <p className="font-semibold text-lg lg:text-xl text-primary">
        Ingrese con su cuenta de GitHub
      </p>
      <div className="flex justify-center">
        <button
          onClick={handleSignIn}
          className="font-primary font-normal bg-black text-[13px] text-white flex items-center justify-center px-4 py-2 rounded-md 
                            shadow hover:bg-gray-800 transition"
        >
          <FaGithub className="mr-2" />
          Login with GitHub
        </button>
      </div>
      </div>
    </div>
  );
}
