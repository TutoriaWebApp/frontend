"use client";

import React from "react";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import {NotificationContext} from "../contexts/NotificationContext/NotificationContext"

import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ForgotPasswordForm(): React.ReactNode {
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  const {showNotification} = useContext(NotificationContext);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    showNotification("Link de redefinição enviado com sucesso! Verifique sua caixa de entrada!", "success");

    router.push("/")
  };
  return (
    <>
      <div
        className="
          bg-white
          w-full
          rounded-3xl
          shadow-xl shadow-slate-200/50
          pb-6
          "
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="flex flex-col mb-8 pl-6">
            <span className="font-semibold mb-2">E-mail</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                bg-white  
                w-[470px]
                text-slate-900
                rounded-md
                leading-7
                border-2
                border-slate-300
                          "
              placeholder="Digite o seu e-mail"
            />
          </label>
          <button
            className="
              bg-indigo-600
              hover:bg-indigo-800
              w-[470px]
              rounded-md
              text-white
              font-semibold
              h-[40px]
              transition-all
              m-auto
              mb-5
              "
          >
            Enviar link de redefinição
          </button>{" "}
        </form>
        <Link
          href={"/"}
          className="p-4 pb-0 flex items-center text-brand-primary hover:font-bold hover:underline transition-all"
        >
          <ArrowBackIcon className="mr-1" />
          <span>Voltar para o Login</span>
        </Link>
      </div>
    </>
  );
}
