"use client";

import React, { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSessionExpired } from "../contexts/SessionExpiredContext/SessionExpiredContext";
import { useSearchParams } from "next/navigation";
import { isTokenExpired } from "@repo/lib/jwtAux";

import { LogInAction } from "../../../services/src/actions/auth";

import { ClipLoader } from "react-spinners";

const loginSchema = z.object({
  username: z.email("E-mail inválido").min(1, "O e-mail é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginForm({
  access_token,
  refresh_token,
}: {
  access_token: string | undefined;
  refresh_token: string | undefined;
}): React.ReactNode {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const sessionExpired = useSessionExpired();

  useEffect(() => {
    if (searchParams.get("session") === "expired") {
      sessionExpired.triggerSessionExpired();
    }
  }, [searchParams]);

  useEffect(() => {
    const checkToken = async (
      access_token: string | undefined,
      refresh_token: string | undefined,
    ) => {
      if (!isTokenExpired(access_token) || !isTokenExpired(refresh_token)) {
        router.push("/dashboard");
      }
    };

    checkToken(access_token, refresh_token);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginData) => {
    setServerError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const result = await LogInAction(null, formData);

      if (result.success) {
        router.push("/dashboard");
      } else {
        setServerError(result.message);
      }
    });
  };

  return (
    <>
      {isPending && (
        <div
          className="
            w-full 
            md:w-[450px]
            p-4
        "
        >
          <div
            className="
              bg-slate-100 
                rounded-md
                border-2 
              border-slate-200 
                shadow-sm 
                md:w-[340px]
                mt-8
                h-[440px]
                2xl:w-full
                2xl:mt-16
                flex
                items-center
                justify-center
          "
          >
            <ClipLoader color="#64748b" size={120} />
          </div>
        </div>
      )}
      {!isPending && (
        <div
          className="
            w-full 
            md:w-[450px]
            p-4
        "
        >
          <div
            className="
        bg-slate-100 
        rounded-md border-2 
        border-slate-200 
        shadow-sm 
        md:w-[340px]
        mt-8
        h-fit 
        2xl:w-full
        2xl:mt-16
      "
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="
          flex 
          flex-col
        "
            >
              <label
                className="
            flex
            flex-col
            gap-4
          "
              >
                <span
                  className="
              font-semibold 
              mt-4
              ml-6
            "
                >
                  E-mail
                </span>
                <input
                  type="email"
                  {...register("username")}
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
                  defaultValue={""}
                />
                {errors.username && (
                  <span className="text-rose-500 md:text-sm 2xl:text-base pl-6">
                    {errors.username.message}
                  </span>
                )}
              </label>
              <label
                className="
            flex 
            flex-col
            gap-4
          "
              >
                <span
                  className="
              font-semibold 
              mt-4 
              ml-6
              "
                >
                  Senha
                </span>
                <input
                  type="password"
                  {...register("password")}
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
                  defaultValue={""}
                />
              </label>
              {errors.password && (
                <span className="text-rose-500 md:text-sm 2xl:text-base pl-6">
                  {errors.password.message}
                </span>
              )}

              <button
                className="
              bg-indigo-600 
              hover:bg-indigo-800
              w-3/5 
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
                disabled={isPending}
              >
                Entrar
              </button>
              {serverError && (
                <span className="text-rose-500 font-medium text-center">
                  {serverError}
                </span>
              )}
              <div
                className="
            self-center 
            border-t-4 
          border-slate-400 
            w-[90%]
            mt-2
          "
              ></div>
              <Link
                href={"esqueci-senha"}
                className="
              text-brand-primary 
              hover:font-bold 
              transition-all 
              self-center 
              mt-4 
              hover:underline
            "
              >
                Esqueceu sua senha?
              </Link>
              <Link href={"/criar-conta"} className="flex justify-center">
                <button
                  className="
            bg-emerald-600 
            hover:bg-emerald-800 
              w-3/5 
              rounded-md 
              text-white 
              font-semibold 
              h-[40px] 
              transition-all 
              mb-6 
              mt-4
              2xl:h-[44px]
            "
                >
                  Criar nova conta
                </button>
              </Link>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
