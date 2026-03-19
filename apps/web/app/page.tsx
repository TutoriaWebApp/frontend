import React from "react";
import Image from "next/image";

import LoginForm from "@repo/ui/LoginForm/LoginForm";

export default function Home(): React.ReactNode {
  return (
    <>
      <div className="
        flex 
        flex-col 
        md:flex-row 
        min-h-[calc(100vh-80px)] 
        w-full 
        items-center 
        justify-center
        p-4
        2xl:p-16
      ">
        <div className="
          flex-1 
          flex 
          flex-col 
          items-center 
          justify-center 
          w-full 
          h-full
          gap-8
          2xl:gap-16
        ">
          <h2 className="
            text-2xl 
            text-center 
            font-quicksand
            2xl:text-3xl
            ">
            Aprendendo melhor juntos!
          </h2>

          <div className="
            relative 
            w-full 
            h-[300px] 
            sm:h-[400px] 
            lg:h-[500px]
            2xl:h-[600px]
          ">
            <Image
              src="/login-students.jpg"
              alt="Estudantes aprendendo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <LoginForm/>
      </div>
    </>
  );
}
