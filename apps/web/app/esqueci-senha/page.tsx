import React from "react";

import ForgotPasswordForm from "@repo/ui/ForgotPasswordForm.tsx/ForgotPasswordForm";

export default function ForgotPassword(): React.ReactNode {
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
         w-[520px]
        "
      >
        <div className="flex flex-col items-center mb-4">
          <h2 className="font-quicksand text-2xl font-bold m-5">
            Recuperação de Senha
          </h2>
          <span className="mb-5 text-slate-500">
            Informe seu e-mail para receber um link de redefinição de senha.
          </span>
        </div>
        <ForgotPasswordForm/>
      </div>
    </div>
  );
}
