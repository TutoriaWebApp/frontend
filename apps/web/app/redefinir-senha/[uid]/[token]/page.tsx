"use client";

import React from "react";

import { useState, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { NotificationContext } from "@repo/ui/contexts/NotificationContext/NotificationContext";
import {validateJwt} from "@repo/lib/jwtAux"

import VisibilityIcon from "@mui/icons-material/Visibility";

const registerSchema = z
  .object({
    password: z
      .string()
      .min(10, "A senha deve possuir 10 ou mais caracteres.")
      .regex(/[!@#$%^&*]/, "A senha deve conter um caractere especial.")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número."),

    passwordConfirm: z
      .string()
      .min(10, "A senha deve possuir 10 ou mais caracteres.")
      .regex(/[!@#$%^&*]/, "A senha deve conter um caractere especial.")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "As senhas devem ser iguais.",
    path: ["passwordConfirm"], 
  });

type RegisterData = z.infer<typeof registerSchema>;

const onSubmit = async (data: RegisterData) => {
  console.log("Dados validados:", data);
  // Aqui chamarias a tua Server Action ou API
};

export default function ForgotPassword(): React.ReactNode {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange"
  });

  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState<boolean>(false);

  const router = useRouter();

  const { showNotification } = useContext(NotificationContext);

  // const handleSubmit = (e: any) => {
  //   e.preventDefault();

  //   if (newPassword != confirmNewPassword) {
  //     showNotification("As senhas nos dois campos devem ser iguais!", "error");
  //     return;
  //   } else if (newPassword == "" || confirmNewPassword == "") {
  //     showNotification("Informe a senha nos dois campos!", "error");
  //     return;
  //   } else if (!requirements.all) {
  //     showNotification("A senha não atende à todos os critérios!", "error");
  //     return;
  //   } else {
  //     showNotification("Senha redefinida com sucesso!", "success");
  //     router.push("/");
  //   }
  // };

  return (
    <div className="bg-slate-50">
      <div
        className="
         bg-white 
         mx-auto
         relative
         md:top-[5%]
         rounded-3xl
         border 
         border-slate-200
         shadow-xl
       shadow-slate-200/50
         w-fit
         2xl:top-[15%]
        "
      >
        <div
          className="
          flex
          flex-col
          items-center
          mb-4
          "
        >
          <h2 className="font-quicksand text-2xl font-bold m-5">
            Redefinição de Senha
          </h2>
        </div>
        <div
          className="
          bg-white
          w-full
          rounded-3xl
          shadow-xl shadow-slate-200/50
          pb-6
          "
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="flex items-center">
              <label className="flex flex-col pl-6">
                <span className="font-semibold mb-2">Nova senha</span>
                <input
                  type={showNewPassword ? "text" : "password"}
                  {...register("password")}
                  className="
                bg-white  
                w-[470px]
                text-slate-900
                rounded-md
                leading-7
                border-2
                border-slate-300
                "
                  placeholder="Digite a nova senha"
                />
              </label>
              <div
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="flex items-center border-2 border-slate-300 bg-white rounded-md h-[2rem] pr-2 pl-2 mr-6 mt-8 cursor-pointer"
              >
                <VisibilityIcon className="mr-1" />
                Mostrar
              </div>
            </div>
            <div className="mb-6 pl-6 mt-4 flex flex-col">
              {errors.password && (
                <span className="text-rose-500 text-sm mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>
            <div className="flex items-center">
              <label className="flex flex-col pl-6">
                <span className="font-semibold mb-2">
                  Confirme a nova senha
                </span>
                <input
                  type={showConfirmNewPassword ? "text" : "password"}
                  {...register("passwordConfirm")}
                  className="
                bg-white  
                w-[470px]
                text-slate-900
                rounded-md
                leading-7
                border-2
                border-slate-300
                          "
                  placeholder="Digite a nova senha novamente"
                />
              </label>
              <div
                onClick={() =>
                  setShowConfirmNewPassword(!showConfirmNewPassword)
                }
                className="flex items-center border-2 border-slate-300 bg-white rounded-md h-[2rem] pr-2 pl-2 mr-6 mt-8 cursor-pointer"
              >
                <VisibilityIcon className="mr-1" />
                Mostrar
              </div>
            </div>
            <div className="pl-6 mt-4 flex flex-col">
              {errors.passwordConfirm && (
                <span className="text-rose-500 text-sm mt-1">
                  {errors.passwordConfirm.message}
                </span>
              )}
            </div>
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
              mt-8
              "
            >
              Redefinir a senha
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
