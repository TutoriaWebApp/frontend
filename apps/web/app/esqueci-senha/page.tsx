"use client";

import React from "react";

import { useActionState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NotificationContext } from "@repo/ui/contexts/NotificationContext/NotificationContext";

import { RequestPasswordResetAction } from "@repo/services/authAction";

import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ForgotPassword(): React.ReactNode {
  const router = useRouter();

  const { showNotification } = useContext(NotificationContext);

  const [state, formAction, isPending] = useActionState(
    RequestPasswordResetAction,
    {
      success: null,
      message: "",
      email: "",
    },
  );

  useEffect(() => {
    if (state.success) {
      showNotification(state.message, "success");

      router.push("/");
    }
  }, [state]);

  return (
    <div
      className="
    bg-slate-50
    "
    >
      <div
        className="
         bg-white
         relative
         md:top-[15%]
         mx-auto 
         rounded-3xl
         border
       border-slate-200
         shadow-xl
       shadow-slate-200/50
         w-[520px]
         2xl:w-[640px]
         2xl:top-[20%]
        "
      >
        <div
          className="
          flex
          flex-col
          mb-4
        "
        >
          <h2 className="font-quicksand text-2xl font-bold m-5 text-center">
            Recuperação de Senha
          </h2>
          <span
            className="
            mb-5 
          text-slate-500
            text-center
          "
          >
            Informe seu e-mail para receber um link de redefinição de senha.
          </span>
        </div>
        <div
          className="
          bg-white
          w-full
          rounded-3xl
          shadow-xl
        shadow-slate-200/50
          pb-6
          "
        >
          <form
            action={formAction}
            className="
            flex 
            flex-col
            gap-8
          "
          >
            <label
              className="f
              flex 
              flex-col 
              pl-6
              2xl:pl-10
              gap-2
            "
            >
              <span className="font-semibold mb-2">E-mail</span>
              <input
                type="email"
                name="email"
                className="
                bg-white  
                w-[470px]
                text-slate-900
                rounded-md
                leading-7
                border-2
                border-slate-300
                2xl:w-[560px]
                "
                placeholder="Digite o seu e-mail"
                defaultValue={state.email}
                required
              />
            </label>
            {state.success === false && (
              <span
                className="
              pl-6 
              text-rose-500
            "
              >
                {state.message}
              </span>
            )}
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
              mx-auto
              mb-5
              2xl:w-[560px]
              "
              disabled={isPending}
            >
              Enviar link de redefinição
            </button>{" "}
          </form>
          <Link
            href={"/"}
            className="
              p-4 
              pb-0 
              flex 
              items-center
            text-brand-primary 
              hover:font-bold 
              hover:underline 
              transition-all
          "
          >
            <ArrowBackIcon className="mr-1" />
            <span>Voltar para o Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
