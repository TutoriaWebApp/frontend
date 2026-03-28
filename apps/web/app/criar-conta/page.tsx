"use client";

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { NotificationContext } from "@repo/ui/contexts/NotificationContext/NotificationContext";

import { GetStates } from "@repo/services/states";
import { StateResult } from "../../../../packages/services/src/types/states";
import { GetCities } from "@repo/services/cities";
import { CityResult } from "../../../../packages/services/src/types/cities";

import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { ClipLoader } from "react-spinners";

import { ImageUpload } from "@repo/ui/ImageUpload/ImageUpload";

import { CreateAccountAction } from "@repo/services/user";

const registerSchema = z
  .object({
    email: z
      .email({ message: "E-mail inválido." })
      .min(1, "É obrigatório informar seu e-mail")
      .max(254, "O e-mail só pode conter até 254 caracteres"),
    password: z
      .string()
      .min(10, "A senha deve possuir 10 ou mais caracteres.")
      .max(256, "A senha só pode possuir até 256 caracteres.")
      .regex(/[!@#$%^&*]/, "A senha deve conter um caractere especial.")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número."),
    nomePerfil: z
      .string()
      .min(1, "É obrigatório informar seu nome.")
      .max(100, "O nome só pode conter até 100 caracteres."),
    estado: z.string().min(1, "É obrigatório informar seu estado."),
    cidade: z.string().min(1, "É obrigatório infomar sua cidade"),
    aniversario: z
      .string()
      .refine(
        (stringDate) => {
          if (!stringDate) {
            return true;
          }

          const date = new Date(stringDate);

          return !isNaN(date.getTime());
        },
        { message: "Data inválida." },
      )
      .refine(
        (stringDate) => {
          if (!stringDate) {
            return true;
          }
          const date = new Date(stringDate);

          const currentDate = new Date();

          return date <= currentDate;
        },
        { message: "A data não pode ser futura." },
      )
      .nullable(),
    foto: z
      .any()
      .refine(
        (file) => file instanceof File,
        "A foto de perfil é obrigatória.",
      ),
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

export default function CreateAccountPage(): React.ReactNode {
  const methods = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = methods;

  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [states, setStates] = useState<StateResult[]>([]);
  const [cities, setCities] = useState<CityResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [preview, setPreview] = useState<string | null>(null);

  const selectedEstado = watch("estado", "");

  const router = useRouter();
  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    async function fetchStates() {
      setLoading(true);

      const res = await GetStates();

      if (typeof res === "string") {
        showNotification(res, "error");
        return;
      }

      setStates(res);

      setLoading(false);
    }
    fetchStates();
  }, []);

  useEffect(() => {
    async function fetchCities() {
      const res = await GetCities(selectedEstado);

      if (typeof res === "string") {
        showNotification(res, "error");
        return;
      }

      setCities(res);

      setLoading(false);
    }
    fetchCities();
  }, [selectedEstado]);

  const handleAdvanceStep = async () => {
    const isValid = await trigger([
      "nomePerfil",
      "email",
      "password",
      "passwordConfirm",
      "estado",
      "cidade",
      "foto",
      "aniversario",
    ]);

    if (isValid) {
      setStep(2);
    } else {
      showNotification(
        "Preencha todos os campos obrigatórios corretamente.",
        "error",
      );
    }
  };

  const onSubmit = async (data: RegisterData) => {
    const { passwordConfirm, ...rest } = data;

    const formData = new FormData();

    formData.append("nomePerfil", rest.nomePerfil);
    formData.append("email", rest.email);
    formData.append("password", rest.password);
    formData.append("estado", rest.estado);
    formData.append("cidade", rest.cidade);
    formData.append("aniversario", rest.aniversario || "");
    formData.append("foto", rest.foto);

      const result = await CreateAccountAction(formData);

      if (result.success) {
        showNotification(result.message, "success");
        router.push("/");
      } else {
        showNotification(result.message, "error");
      }
    
  };

  return (
    <div className="bg-slate-50">
      <FormProvider {...methods}>
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
         w-[calc(100%-33%)]
        "
        >
          <div
            className="
          flex 
          flex-col 
          items-center 
        "
          >
            <h2
              className="
            font-quicksand 
            text-2xl 
            font-bold 
            text-center
            m-5
          "
            >
              Criar Conta
            </h2>
          </div>
          {/* Barra de Progresso */}
          <div className="w-full px-12 py-8">
            <div className="relative flex items-center justify-between w-full">
              {/* Linha de Fundo (Cinza) */}
              <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 z-0" />

              {/* Linha de Progresso Ativa (Indigo) */}
              <div
                className="absolute top-5 left-0 h-0.5 bg-indigo-600 transition-all duration-500 ease-in-out z-0"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />

              {/* Etapa 1: Informações Pessoais */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    step >= 1
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-white border-slate-300 text-slate-400"
                  }`}
                >
                  {step > 1 ? "✓" : "1"}
                </div>
                <span
                  className={`text-xs font-bold transition-all ${step >= 1 ? "text-indigo-600" : "text-slate-400"}`}
                >
                  Informações Pessoais
                </span>
              </div>

              {/* Etapa 2: Perfil */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    step >= 2
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-white border-slate-300 text-slate-400"
                  }`}
                >
                  {step > 2 ? "✓" : "2"}
                </div>
                <span
                  className={`text-xs font-bold transition-all ${step >= 2 ? "text-indigo-600" : "text-slate-400"}`}
                >
                  Áreas de Interesse
                </span>
              </div>

              {/* Etapa 3: Perfil de Tutor */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    step >= 3
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-white border-slate-300 text-slate-400"
                  }`}
                >
                  3
                </div>
                <span
                  className={`text-xs font-bold transition-all ${step >= 3 ? "text-indigo-600" : "text-slate-400"}`}
                >
                  Perfil como Tutor
                </span>
              </div>
            </div>
          </div>
          {!loading && step == 1 && (
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
                <ImageUpload
                  name="foto"
                  label="Foto de Perfil"
                  required={true}
                />
                <form
                  className="
                grid 
                grid-cols-2
                gap-6
              "
                >
                  <div
                    className="
                  flex 
                  items-center
                "
                  >
                    <label
                      className="
                    flex 
                    flex-col 
                    pl-6
                    w-full
                    gap-2
                  "
                    >
                      <span
                        className="
                      font-semibold 
                    "
                      >
                        Nome<span className="text-rose-500">*</span>
                      </span>
                      <input
                        type="text"
                        {...register("nomePerfil")}
                        className="
                      bg-white  
                        w-full
                      text-slate-900
                        rounded-md
                        leading-7
                        border-2
                      border-slate-300
                  "
                        placeholder="Digite seu nome e sobrenome"
                      />
                    </label>
                  </div>
                  <div
                    className="
                  flex 
                  items-center
                "
                  >
                    <label
                      className="
                    flex 
                    flex-col 
                    pl-6
                    w-full
                    gap-2
                  "
                    >
                      <span
                        className="
                      font-semibold
                    "
                      >
                        E-mail<span className="text-rose-500">*</span>
                      </span>
                      <input
                        type="email"
                        {...register("email")}
                        className="
                      bg-white  
                        w-[calc(100%-4%)]
                      text-slate-900
                        rounded-md
                        leading-7
                        border-2
                      border-slate-300
                    "
                        required
                        placeholder="Digite seu e-mail"
                      />
                    </label>
                  </div>
                  <div
                    className="
                  mb-6 
                  pl-6 
                "
                  >
                    {errors.nomePerfil && (
                      <span className="text-rose-500 md:text-sm 2xl:text-base mt-1">
                        {errors.nomePerfil.message}
                      </span>
                    )}
                  </div>
                  <div
                    className="
                  pl-6 
                "
                  >
                    {errors.email && (
                      <span className="text-rose-500 md:text-sm 2xl:text-base mt-1">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <div
                    className="
                  flex 
                  items-center
                "
                  >
                    <label
                      className="
                    flex 
                    flex-col 
                    pl-6
                    w-full
                    gap-2
                  "
                    >
                      <span
                        className="
                      font-semibold
                    "
                      >
                        Senha<span className="text-rose-500">*</span>
                      </span>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        {...register("password")}
                        className="
                        bg-white  
                        w-full
                      text-slate-900
                        rounded-md
                        leading-7
                        border-2
                        border-slate-300
                      "
                        placeholder="Digite uma senha"
                      />
                    </label>
                    <div
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="
                      flex 
                      items-center 
                      border-2 
                      border-slate-300 
                      bg-white 
                      rounded-md 
                      h-[2rem] 
                      pr-2 
                      pl-2 
                      mt-8 
                      cursor-pointer
                    "
                    >
                      <VisibilityIcon
                        className="
                      mr-1
                    "
                      />
                      Mostrar
                    </div>
                  </div>
                  <div
                    className="
                  flex 
                  items-center
                "
                  >
                    <label
                      className="
                    flex 
                    flex-col 
                    pl-6
                    w-full
                    gap-2
                  "
                    >
                      <span
                        className="
                      font-semibold
                    "
                      >
                        Confirme a senha<span className="text-rose-500">*</span>
                      </span>
                      <input
                        type={showConfirmNewPassword ? "text" : "password"}
                        {...register("passwordConfirm")}
                        className="
                      bg-white  
                        w-full
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
                      className="
                      flex 
                      items-center 
                      border-2 
                      border-slate-300 
                      bg-white 
                      rounded-md 
                      h-[2rem] 
                      pr-2 
                      pl-2 
                      mr-5 
                      mt-8 
                      cursor-pointer
                    "
                    >
                      <VisibilityIcon className="mr-1" />
                      Mostrar
                    </div>
                  </div>
                  <div
                    className="
                  mb-6 
                  pl-6 
                  "
                  >
                    {errors.password && (
                      <span className="text-rose-500 md:text-sm 2xl:text-base mt-1">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                  <div
                    className="
                  pl-6 
                  "
                  >
                    {errors.passwordConfirm && (
                      <span className="text-rose-500 md:text-sm 2xl:text-base mt-1">
                        {errors.passwordConfirm.message}
                      </span>
                    )}
                  </div>
                  <div
                    className="
                  flex 
                  items-center
                "
                  >
                    <label
                      className="
                    flex 
                    flex-col 
                    pl-6 
                    mb-4
                    w-full
                    gap-2
                    "
                    >
                      <span
                        className="
                      font-semibold
                      "
                      >
                        Estado<span className="text-rose-500">*</span>
                      </span>
                      <select
                        {...register("estado")}
                        className="
                      bg-white  
                      w-full
                      text-slate-900
                      rounded-md
                      py-1
                        border-2
                        border-slate-300"
                        defaultValue={""}
                      >
                        <option value="" disabled hidden>
                          Selecione uma opção
                        </option>
                        {states?.map((state) => (
                          <option key={state.id} value={state.sigla}>
                            {state.nome}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div
                    className="
                  flex 
                  items-center
                  "
                  >
                    <label
                      className="
                    flex 
                    flex-col 
                    pl-6 
                    mb-4
                    w-full
                    gap-2
                    "
                    >
                      <span
                        className="
                      font-semibold
                      "
                      >
                        Cidade<span className="text-rose-500">*</span>
                      </span>
                      <select
                        {...register("cidade")}
                        className={`${selectedEstado != "" ? "bg-white" : "bg-gray-300"}  
                      w-[calc(100%-6%)]
                      text-slate-900
                      rounded-md
                      py-1
                      border-2
                      border-slate-300
                      `}
                        disabled={
                          selectedEstado != "" && cities.length > 0
                            ? false
                            : true
                        }
                        defaultValue={""}
                      >
                        <option value="" disabled hidden>
                          Selecione uma opção
                        </option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.nome}>
                            {city.nome}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div
                    className="
                  mb-6 
                  pl-6 
                  "
                  >
                    {errors.estado && (
                      <span className="text-rose-500 md:text-sm 2xl:text-base mt-1">
                        {errors.estado.message}
                      </span>
                    )}
                  </div>
                  <div
                    className="
                  pl-6 
                  "
                  >
                    {errors.cidade && (
                      <span className="text-rose-500 md:text-sm 2xl:text-base mt-1">
                        {errors.cidade.message}
                      </span>
                    )}
                  </div>
                  <div
                    className="
                  flex
                  flex-col 
                  "
                  >
                    <label
                      className="
                    flex 
                    pl-6 
                    w-full
                    gap-2
                    "
                    >
                      <span
                        className="
                      font-semibold
                      "
                      >
                        Data de Nascimento
                      </span>
                      - <input type="date" {...register("aniversario")} />
                    </label>
                    <div
                      className="
                  pl-6
                  mt-4
                "
                    >
                      {errors.aniversario && (
                        <span className="text-rose-500 md:text-sm 2xl:text-base mt-1">
                          {errors.aniversario.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div></div>
                </form>
                <div className="flex justify-between p-4">
                  <Link
                    href={"/"}
                    className="p-4 pb-0 flex items-center text-brand-primary hover:font-bold hover:underline transition-all"
                  >
                    <ArrowBackIcon className="mr-1" />
                    <span>Voltar para o Login</span>
                  </Link>
                  <div
                    className="p-4 pb-0 flex items-center text-brand-primary hover:font-bold transition-all cursor-pointer"
                    onClick={handleSubmit(onSubmit)}
                  >
                    <span>Avançar</span>
                    <ArrowForwardIcon className="ml-1" />
                  </div>
                </div>
              </div>
            </>
          )}
          {loading && (
            <ClipLoader
              color="#64748b"
              className="relative left-[47%]"
              size={120}
            />
          )}
          {step == 2 && (
            <>
              {/*Barra de Progresso*/}
              <div></div>
              <div
                className="
              bg-white
              w-full
              rounded-3xl
              shadow-xl shadow-slate-200/50
              pb-6
              "
              ></div>
            </>
          )}
        </div>
      </FormProvider>
    </div>
  );
}
