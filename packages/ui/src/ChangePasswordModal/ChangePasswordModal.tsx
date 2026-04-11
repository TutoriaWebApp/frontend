"use client";

import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { NotificationContext } from "../contexts/NotificationContext/NotificationContext";

import { ChangePasswordAction } from "@repo/services/userAction";
import { ChangePassword } from "@repo/services/userClient";

const registerSchema = z
  .object({
    password: z.string(),

    newPassword: z
      .string()
      .min(10, "A senha deve possuir 10 ou mais caracteres.")
      .max(256, "A senha só pode possuir até 256 caracteres.")
      .regex(/[!@#$%^&*]/, "A senha deve conter um caractere especial.")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número."),

    newPasswordConfirm: z
      .string()
      .min(10, "A senha deve possuir 10 ou mais caracteres.")
      .max(256, "A senha só pode possuir até 256 caracteres.")
      .regex(/[!@#$%^&*]/, "A senha deve conter um caractere especial.")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número."),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "A nova senha deve ser igual nos dois campos.",
    path: ["newPasswordConfirm"],
  });

type RegisterData = z.infer<typeof registerSchema>;

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  const { showNotification } = useContext(NotificationContext);

  //Fechando a modal
  if (!isOpen) {
    return null;
  }

  const onSubmit = async (data: RegisterData) => {
    const { newPasswordConfirm, ...rest } = data;

    const res = await ChangePasswordAction(rest.password, rest.newPassword);

    setErrorMessage("");

    if (res.success) {
      showNotification("A senha foi alterada com sucesso!", "success");
      reset();
      onClose();
    }
    if (!res.success) {
      if (res.status === 401) {
        router.push("/?session=expired");
      } 
      else{
        setErrorMessage(res.message)
      }
    }
  };

  return (
    <div
      className="
        fixed 
        inset-0 
        z-50 
        flex 
        items-center 
        justify-center 
        bg-black/50 
        backdrop-blur-sm 
        p-4
    "
    >
      <div
        className="
            bg-white 
            w-full 
            max-w-2xl 
            rounded-3xl 
            shadow-2xl 
            overflow-hidden 

        "
      >
        {/* Header */}
        <div
          className="
            flex
            justify-between
            items-center 
            p-6 
            border-b 
            border-slate-100
        "
        >
          <h2
            className="
            text-xl 
            font-bold 
            "
          >
            Alterar Senha
          </h2>
          <button
            onClick={onClose}
            className="
                text-slate-400 
                hover:text-slate-600 
                transition-colors
            "
          >
            <CloseIcon />
          </button>
        </div>

        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="flex items-center mb-6 pt-6 pb-3">
              <label className="flex flex-col pl-6">
                <span className="font-semibold mb-2">Senha Atual</span>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="
                bg-white  
                w-[500px]
                text-slate-900
                rounded-md
                leading-7
                border-2
                border-slate-300
                "
                  placeholder="Digite a senha atual"
                />
              </label>
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center border-2 border-slate-300 bg-white rounded-md h-[2rem] pr-2 pl-2 mr-6 mt-8 cursor-pointer"
              >
                <VisibilityIcon className="mr-1" />
                Mostrar
              </div>
            </div>
            <div className="flex items-center">
              <label className="flex flex-col pl-6">
                <span className="font-semibold mb-2">Nova Senha</span>
                <input
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword")}
                  className="
                bg-white  
                w-[500px]
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
              {errors.newPassword && (
                <span className="text-rose-500 text-base mt-1">
                  {errors.newPassword.message}
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
                  {...register("newPasswordConfirm")}
                  className="
                bg-white  
                w-[500px]
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
            <div className="pl-6 pb-6 mt-4 flex flex-col">
              {errors.newPasswordConfirm && (
                <span className="text-rose-500 text-base mt-1">
                  {errors.newPasswordConfirm.message}
                </span>
              )}
            </div>

            <span className="text-rose-500 text-base mt-1 mb-6 text-center">
              {errorMessage}
            </span>
            {/* Footer */}

            <div
              className="
            p-6 
            bg-slate-50 
            flex 
            justify-end 
            gap-12 
            border-t 
            border-slate-100
        "
            >
              <div
                onClick={onClose}
                className="
                px-6 
                py-2.5 
                rounded-xl 
                font-bold
                bg-slate-300
                text-slate-500 
                hover:bg-slate-400
                hover:text-slate-700 
                transition-all
                cursor-pointer
            "
              >
                Cancelar
              </div>
              <button
                type="submit"
                className={`
                px-8 
                py-2.5 
                rounded-xl 
                bg-brand-primary 
                text-white 
                font-bold 
                shadow-lg 
                shadow-brand-primary/20 
                hover:bg-indigo-800
                disabled:bg-gray-500
                transition-all
            `}
              >
                Alterar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
