"use client";

import React from "react";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { NotificationContext } from "@repo/ui/contexts/NotificationContext/NotificationContext";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function ForgotPassword(): React.ReactNode {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [requirements, setRequirements] = useState({
    length: false,
    special: false,
    number: false,
    all: false,
  });
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false);


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
         m-auto 
         mt-10 
         mb-0
         rounded-3xl
         border border-slate-200
         shadow-xl shadow-slate-200/50
         w-fit
        "
      >
        <div className="flex flex-col items-center mb-4">
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
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex items-center">
              <label className="flex flex-col pl-6">
                <span className="font-semibold mb-2">Nova senha</span>
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
                  placeholder="Digite a nova senha"
                />
              </label>
              <div onClick={() => setShowNewPassword(!showNewPassword)} className="flex items-center border-2 border-slate-300 bg-white rounded-md h-[2rem] pr-2 pl-2 mr-6 mt-8">
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
                    requirements.special ? "text-green-500" : "text-rose-500"
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
            <div className="flex items-center">
              <label className="flex flex-col pl-6">
                <span className="font-semibold mb-2">
                  Confirme a nova senha
                </span>
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
                  placeholder="Digite a nova senha novamente"
                />
              </label>
              <div onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} className="flex items-center border-2 border-slate-300 bg-white rounded-md h-[2rem] pr-2 pl-2 mr-6 mt-8">
                <VisibilityIcon className="mr-1" />
                Mostrar
              </div>
            </div>
            {newPassword != confirmNewPassword && (
              <div className="mt-6 text-rose-500 pl-6">
                <span>As senhas devem ser iguais.</span>
              </div>
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
