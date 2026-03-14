"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

export default function Home(): React.ReactNode {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [failed, setFailed] = useState<boolean>(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] w-full items-center justify-center p-4 font-inter">
        <div className="flex-1 flex flex-col items-center justify-center w-full h-full p-4">
          <h1 className="text-2xl mb-6 text-center font-quicksand">
            Aprendendo melhor juntos!
          </h1>

          <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
            <Image
              src="/login-students.png"
              alt="Estudantes aprendendo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <div className="w-full md:w-[450px] p-4">
          <div className="bg-slate-100 rounded-md border-2 border-slate-200 shadow-sm w-[340px] mt-8 h-fit mr-4">
            <form onSubmit={handleSubmit} className="flex flex-col">
              <label className="flex flex-col">
                <span className="font-semibold m-6 mb-4">E-mail</span>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-blue w-4/5 ml-6 text-slate-900 rounded-md leading-7 border-2 border-slate-300"
                  placeholder="Digite o seu e-mail"
                />
              </label>
              <label className="flex flex-col">
                <span className="font-semibold m-6 mb-4">Senha</span>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-blue w-4/5 ml-6 rounded-md leading-7 mb-6 border-2 border-slate-300"
                  placeholder="Digite a sua senha"
                />
              </label>
              {failed && (
                <span className="ml-6 mb-4 text-rose-500">
                  {" "}
                  Erro: Credenciais inválidas.
                </span>
              )}
              <button
                className="bg-indigo-600 hover:bg-indigo-800 w-4/5 self-center rounded-md text-white font-semibold h-[40px] transition-all mb-4 mt-2"
                onClick={() => setFailed(true)}
              >
                Entrar
              </button>
              <div className="self-center border-t-4 border-slate-400 w-[90%]"></div>
              <Link
                href={"esqueci-senha"}
                className="text-brand-primary hover:font-bold transition-all self-center mt-4 hover:underline"
              >
                Esqueceu sua senha?
              </Link>
              <button className="bg-emerald-600 hover:bg-emerald-800 w-3/5 self-center rounded-md text-white font-semibold h-[40px] transition-all mb-6 mt-4">
                Criar nova conta
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
