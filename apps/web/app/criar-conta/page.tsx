"use client";

import React from "react";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { NotificationContext } from "@repo/ui/contexts/NotificationContext/NotificationContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import Link from "next/link";

export default function CreateAccount(): React.ReactNode {
  //Dados Pessoais
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState<boolean>(false);
  const [requirements, setRequirements] = useState({
    length: false,
    special: false,
    number: false,
    all: false,
  });
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");

  //Perfil

  //Perfil de Tutor

  const [step, setStep] = useState<number>(1);

  const router = useRouter();

  const { showNotification } = useContext(NotificationContext);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (newPassword != confirmNewPassword) {
      showNotification("As senhas nos dois campos devem ser iguais!", "error");
      return;
    } else if (newPassword == "" || confirmNewPassword == "") {
      showNotification("Informe a senha nos dois campos!", "error");
      return;
    } else if (!requirements.all) {
      showNotification("A senha não atende à todos os critérios!", "error");
      return;
    } else {
      showNotification("Senha redefinida com sucesso!", "success");
      router.push("/");
    }
  };

  const checkPassword = (password: string) => {
    const isLengthOk = /.{10,}/.test(password);
    const isSpecialOk = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isNumberOk = /[0-9]/.test(password);

    setNewPassword(password);

    setRequirements({
      length: isLengthOk,
      special: isSpecialOk,
      number: isNumberOk,
      all: isLengthOk && isSpecialOk && isNumberOk,
    });
  };

  return (
    <div className="bg-slate-50">
      <div
        className="
         bg-white
         relative
         top-[9%] 
         mx-auto 
         rounded-3xl
         border 
         border-slate-200
         shadow-xl 
         shadow-slate-200/50
         w-[calc(100%-33%)]
        "
      >
        <div className="
          flex 
          flex-col 
          items-center 
        ">
          <h2 className="
            font-quicksand 
            text-2xl 
            font-bold 
            text-center
            m-5
          ">Criar Conta</h2>
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
                Perfil
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
                Perfil de Tutor
              </span>
            </div>
          </div>
        </div>
        {step == 1 && (
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
              <form onSubmit={handleSubmit} className="
                grid 
                grid-cols-2
                gap-6
              ">
                <div className="
                  flex 
                  items-center
                ">
                  <label className="
                    flex 
                    flex-col 
                    pl-6
                    w-full
                    gap-2
                  ">
                    <span className="
                      font-semibold 
                    ">Nome</span>
                    <input
                      type="text"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="
                      bg-white  
                        w-full
                      text-slate-900
                        rounded-md
                        leading-7
                        border-2
                      border-slate-300
                  "
                      required
                      placeholder="Digite seu nome e sobrenome"
                    />
                  </label>
                </div>
                <div className="
                  flex 
                  items-center
                ">
                  <label className="
                    flex 
                    flex-col 
                    pl-6
                    w-full
                    gap-2
                  ">
                    <span className="
                      font-semibold
                    ">E-mail</span>
                    <input
                      type="text"
                      name="email"
                      value={name}
                      onChange={(e) => setEmail(e.target.value)}
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
                <div className="
                  flex 
                  items-center
                ">
                  <label className="
                    flex 
                    flex-col 
                    pl-6
                    w-full
                    gap-2
                  ">
                    <span className="
                      font-semibold
                    ">Senha</span>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="password"
                      value={newPassword}
                      onChange={(e) => checkPassword(e.target.value)}
                      className="
                        bg-white  
                        w-full
                      text-slate-900
                        rounded-md
                        leading-7
                        border-2
                        border-slate-300
                      "
                      required
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
                    <VisibilityIcon className="
                      mr-1
                    "/>
                    Mostrar
                  </div>
                </div>
                <div className="
                  flex 
                  items-center
                ">
                  <label className="
                    flex 
                    flex-col 
                    pl-6
                    w-full
                    gap-2
                  ">
                    <span className="
                      font-semibold
                    ">Confirme a senha</span>
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      name="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="
                      bg-white  
                        w-full
                      text-slate-900
                        rounded-md
                        leading-7
                        border-2
                      border-slate-300
                      "
                      required
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
                    ">
                    <VisibilityIcon className="mr-1" />
                    Mostrar
                  </div>
                </div>
                <div className="
                  mb-6 
                  pl-6 
                  flex 
                  flex-col
                ">
                  <span
                    className={
                      requirements.all ? "text-green-500" : "text-rose-500"
                    }
                  >
                    A senha deve possuir:
                  </span>
                  <ul className="list-disc pl-4">
                    <li
                      className={
                        requirements.length ? "text-green-500" : "text-rose-500"
                      }
                    >
                      <span>10 ou mais caracteres;</span>
                    </li>
                    <li
                      className={
                        requirements.special
                          ? "text-green-500"
                          : "text-rose-500"
                      }
                    >
                      <span>1 caractere especial;</span>
                    </li>
                    <li
                      className={
                        requirements.number ? "text-green-500" : "text-rose-500"
                      }
                    >
                      <span>1 número.</span>
                    </li>
                  </ul>
                </div>
                {newPassword != confirmNewPassword && (
                  <div className="
                    text-rose-500 
                    pl-6
                  ">
                    <span>As senhas devem ser iguais.</span>
                  </div>
                )}
                {newPassword == confirmNewPassword && <div></div>}
                <div className="
                  flex 
                  items-center
                ">
                  <label className="
                    flex 
                    flex-col 
                    pl-6 
                    mb-4
                    w-full
                    gap-2
                  ">
                    <span className="
                      font-semibold
                    ">Estado</span>
                    <select
                      name="state"
                      className="
                      bg-white  
                        w-full
                      text-slate-900
                        rounded-md
                        py-1
                        border-2
                      border-slate-300"
                      onChange={(e) => setState(e.target.value)}
                      required
                      value={state}
                    >
                      <option value="" disabled hidden>
                        Selecione uma opção
                      </option>
                      <option value="Maranhão">Rio Grande do Norte</option>
                    </select>
                  </label>
                </div>
                <div className="
                  flex 
                  items-center
                ">
                  <label className="
                    flex 
                    flex-col 
                    pl-6 
                    mb-4
                    w-full
                    gap-2
                  ">
                    <span className="
                      font-semibold
                    ">Cidade</span>
                    <select
                      name="state"
                      className={`${state != "" ? "bg-white" : "bg-gray-300"}  
                        w-[calc(100%-6%)]
                      text-slate-900
                        rounded-md
                        py-1
                        border-2
                      border-slate-300
                    `}
                      disabled={state != "" ? false : true}
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option value="" disabled hidden>
                        Selecione uma opção
                      </option>
                      <option value="Maranhão">
                        Vila Bela da Santíssima Trindade
                      </option>
                    </select>
                  </label>
                </div>
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
                  onClick={() => setStep(2)}
                >
                  <span>Avançar</span>
                  <ArrowForwardIcon className="ml-1" />
                </div>
              </div>
            </div>
          </>
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
            >
              <form onSubmit={handleSubmit} className="grid grid-cols-2">
                <div className="flex items-center">
                  <label className="flex flex-col pl-6 mb-4">
                    <span className="font-semibold mb-2">aaaaa</span>
                    <input
                      type="text"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="
                  bg-white  
                  w-[470px]
                  text-slate-900
                  rounded-md
                  leading-7
                  border-2
                  border-slate-300
                  "
                      required
                      placeholder="Digite seu nome e sobrenome"
                    />
                  </label>
                </div>
                <div className="flex items-center">
                  <label className="flex flex-col pl-6 mb-4">
                    <span className="font-semibold mb-2">E-mail</span>
                    <input
                      type="text"
                      name="email"
                      value={name}
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
                      required
                      placeholder="Digite seu e-mail"
                    />
                  </label>
                </div>
                <div className="flex items-center">
                  <label className="flex flex-col pl-6">
                    <span className="font-semibold mb-2">Senha</span>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="password"
                      value={newPassword}
                      onChange={(e) => checkPassword(e.target.value)}
                      className="
                  bg-white  
                  w-[470px]
                  text-slate-900
                  rounded-md
                  leading-7
                  border-2
                  border-slate-300
                  "
                      required
                      placeholder="Digite uma senha"
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
                <div className="flex items-center">
                  <label className="flex flex-col pl-6">
                    <span className="font-semibold mb-2">Confirme a senha</span>
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      name="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="
                  bg-white  
                  w-[470px]
                  text-slate-900
                  rounded-md
                  leading-7
                  border-2
                  border-slate-300
                  "
                      required
                      placeholder="Digite a nova senha novamente"
                    />
                  </label>
                  <div
                    onClick={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                    className="flex items-center border-2 border-slate-300 bg-white rounded-md h-[2rem] pr-2 pl-2 mr-8 mt-8 cursor-pointer"
                  >
                    <VisibilityIcon className="mr-1" />
                    Mostrar
                  </div>
                </div>
                <div className="mb-6 pl-6 mt-4 flex flex-col">
                  <span
                    className={
                      requirements.all ? "text-green-500" : "text-rose-500"
                    }
                  >
                    A senha deve possuir:
                  </span>
                  <ul className="list-disc pl-4">
                    <li
                      className={
                        requirements.length ? "text-green-500" : "text-rose-500"
                      }
                    >
                      <span>10 ou mais caracteres;</span>
                    </li>
                    <li
                      className={
                        requirements.special
                          ? "text-green-500"
                          : "text-rose-500"
                      }
                    >
                      <span>1 caractere especial;</span>
                    </li>
                    <li
                      className={
                        requirements.number ? "text-green-500" : "text-rose-500"
                      }
                    >
                      <span>1 número.</span>
                    </li>
                  </ul>
                </div>
                {newPassword != confirmNewPassword && (
                  <div className="mt-6 text-rose-500 pl-6">
                    <span>As senhas devem ser iguais.</span>
                  </div>
                )}
                {newPassword == confirmNewPassword && <div></div>}
                <div className="flex items-center">
                  <label className="flex flex-col pl-6 mb-4">
                    <span className="font-semibold mb-2">Estado</span>
                    <select
                      name="state"
                      className="                  bg-white  
                  w-[470px]
                  text-slate-900
                  rounded-md
                  py-1
                  border-2
                  border-slate-300"
                      onChange={(e) => setState(e.target.value)}
                      required
                      value={state}
                    >
                      <option value="" disabled hidden>
                        Selecione uma opção
                      </option>
                      <option value="Maranhão">Rio Grande do Norte</option>
                    </select>
                  </label>
                </div>
                <div className="flex items-center">
                  <label className="flex flex-col pl-6 mb-4">
                    <span className="font-semibold mb-2">Cidade</span>
                    <select
                      name="state"
                      className={`${state != "" ? "bg-white" : "bg-gray-300"}  
                  w-[470px]
                  text-slate-900
                  rounded-md
                  py-1
                  border-2
                border-slate-300
=                  `}
                      disabled={state != "" ? false : true}
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option value="" disabled hidden>
                        Selecione uma opção
                      </option>
                      <option value="Maranhão">
                        Vila Bela da Santíssima Trindade
                      </option>
                    </select>
                  </label>
                </div>
              </form>
              <div className="flex justify-between p-4">
                <div
                  className="p-4 pb-0 flex items-center text-brand-primary hover:font-bold transition-all cursor-pointer"
                  onClick={() => setStep(1)}
                >
                  <ArrowBackIcon className="mr-1" />
                  <span>Voltar</span>
                </div>
                <div
                  className="p-4 pb-0 flex items-center text-brand-primary hover:font-bold transition-all cursor-pointer"
                  onClick={() => setStep(3)}
                >
                  <span>Avançar</span>
                  <ArrowForwardIcon className="ml-1" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
