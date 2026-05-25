import React from "react";
import Image from "next/image";

import { cookies } from "next/headers";

import LoginForm from "@repo/ui/LoginForm/LoginForm";

export default async function Home() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  return (
    <>
      <div
        className="
        flex 
        flex-col 
        md:flex-row 
        min-h-[calc(100vh-80px)] 
        w-full 
        items-center 
        justify-center
        p-4
        2xl:p-16
      "
      >
        <div
          className="
          hidden
          md:flex
          flex-1 
          flex-col 
          items-center 
          justify-center
          gap-8
          2xl:gap-16
          h-full
        "
        >
          <h2
            className="
            text-2xl 
            text-center 
            font-quicksand
            md:block
            2xl:text-3xl
            "
          >
            Aprendendo melhor juntos!
          </h2>

          <div
            className="
            relative 
            w-full
            md:h-[300px]
            md:block
            lg:h-[500px]
            2xl:h-[600px]
          "
          >
            <Image
              src="/login-students.jpg"
              alt="Estudantes aprendendo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <LoginForm access_token={accessToken} refresh_token={refreshToken} />
      </div>
    </>
  );
}
