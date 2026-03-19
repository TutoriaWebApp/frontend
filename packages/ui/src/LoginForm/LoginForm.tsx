"use client";

import React from "react";
import Link from "next/link";

import { useState } from "react";

export default function LoginForm(): React.ReactNode {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [failed, setFailed] = useState<boolean>(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <div className="
      w-full 
      md:w-[450px]
      p-4
    ">
      <div className="
        bg-slate-100 
        rounded-md border-2 
        border-slate-200 
        shadow-sm 
        md:w-[340px]
        mt-8
        h-fit 
        2xl:w-full
        2xl:mt-16
      ">
        <form onSubmit={handleSubmit} className="
          flex 
          flex-col
        ">
          <label className="
            flex
            flex-col
            gap-4
          ">
            <span className="
              font-semibold 
              mt-4
              ml-6
            ">E-mail</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                bg-white 
                border-blue
                md:w-4/5
                ml-6 
                text-slate-900 
                rounded-md 
                leading-7 
                border-2 
                border-slate-300
                2xl:w-[367px]
                "
              placeholder="Digite o seu e-mail"
            />
          </label>
          <label className="
            flex 
            flex-col
            gap-4
          ">
            <span className="
              font-semibold 
              mt-4 
              ml-6
            ">Senha</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                bg-white 
                border-blue 
                md:w-4/5 
                ml-6 
                rounded-md 
                leading-7 
                mb-6 
                border-2 
                border-slate-300
                2xl:w-[367px]"
              placeholder="Digite a sua senha"
            />
          </label>
          {failed && (
            <span className="
              ml-6 
              mb-4 
              text-rose-500
            ">
              Erro: Credenciais inválidas.
            </span>
          )}
          <button
            className="
              bg-indigo-600 
              hover:bg-indigo-800 
              md:w-4/5 
              self-center 
              rounded-md 
              text-white 
              font-semibold 
              h-[40px] 
              transition-all 
              mb-4 
              mt-2
              2xl:h-[44px]
              2xl:w-[367px]
              "
            onClick={() => setFailed(true)}
          >
            Entrar
          </button>
          <div className="
            self-center 
            border-t-4 
          border-slate-400 
            w-[90%]
            mt-2
          "></div>
          <Link
            href={"esqueci-senha"}
            className="
              text-brand-primary 
              hover:font-bold 
              transition-all 
              self-center 
              mt-4 
              hover:underline
            ">
            Esqueceu sua senha?
          </Link>
          <button className="
            bg-emerald-600 
            hover:bg-emerald-800 
              w-3/5 
              self-center 
              rounded-md 
              text-white 
              font-semibold 
              md:h-[40px] 
              transition-all 
              mb-6 
              mt-4
              2xl:h-[44px]
            ">
            <Link href={"/criar-conta"}>
              Criar nova conta
            </Link>
          </button>
        </form>
      </div>
    </div>
  );
}
