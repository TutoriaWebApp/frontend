"use client";

import React from "react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "TutoriaWeb - Aprenda, ensine, evolua!",
//   description:
//     "Se conecte com tutores e aprendizes para aprender e ensinar, conseguir conquistas e níveis e aprender de forma gamificada!",
// };

export default function Home(): React.ReactNode {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="bg-white [grid-area:content] flex justify-around">
      <div>
        <span>Aprendendo melhor juntos!</span>
        <Image
          src="/login-students.png"
          alt="Tutor e aprendiz estudando matemática"
          width={50}
          height={50}
        />
      </div>
      <div className="bg-slate-50 border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="flex flex-col">
            <span className="font-semibold">E-mail</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-black"
            />
          </label>
          <label className="flex flex-col font-semibold">
            <span>Senha</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <span> Erro: Credenciais inválidas.</span>
          <button>Entrar</button>
          <Link href={"esqueci-senha"} className="text-brand-primary hover:font-bold transition-all">
            Esqueceu sua senha?
          </Link>
          <button>Criar nova conta</button>          
        </form>
      </div>
    </div>
  );
}
