"use client";

import React from "react";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

import { NotificationContext } from "@repo/ui/contexts/NotificationContext/NotificationContext";

import { RequestPasswordResetAction } from "@repo/services/authAction";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const forgotPasswordSchema = z.object({
  email: z
    .email("Insira um e-mail válido.")
    .min(1, "O e-mail é obrigatório.")
    .max(254, "O e-mail é longo demais."),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword(): React.ReactNode {
  const router = useRouter();

  const { showNotification } = useContext(NotificationContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordData>({
    mode: "onChange",
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    const formData = new FormData();
    formData.append("email", data.email);

    const result = await RequestPasswordResetAction(null, formData);

    if (result.success) {
      showNotification(
        result.message || "Link enviado com sucesso!",
        "success",
      );
      router.push("/");
    } else {
      showNotification(
        result.message || "Erro ao solicitar redefinição.",
        "error",
      );
    }
  };

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
         mx-auto 
         rounded-3xl
         border
         border-slate-200
         shadow-xl
         shadow-slate-200/50
         w-full
         md:w-[520px]
         2xl:w-[640px]
         top-[15%]
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
            onSubmit={handleSubmit(onSubmit)}
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
                {...register("email")}
                className="
                bg-white
                w-[calc(100vw-40px)]
                md:w-[470px]
                text-slate-900
                rounded-md
                leading-7
                border-2
                border-slate-300
                2xl:w-[560px]
                "
                placeholder="Digite o seu e-mail"
                defaultValue={""}
              />
            </label>
            {errors.email && (
              <span className="text-rose-500 md:text-sm 2xl:text-base pl-6 2xl:pl-10">
                {errors.email.message}
              </span>
            )}
            <button
              className="
              bg-indigo-600
              hover:bg-indigo-800
              w-[calc(100vw-40px)]
              md:w-[470px]
              rounded-md
              text-white
              font-semibold
              h-[40px]
              transition-all
              mx-auto
              mb-5
              2xl:w-[560px]
              "
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar link de redefinição"}
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
