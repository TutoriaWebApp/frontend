"use client";

import React from "react";
import { useRouter } from "next/navigation";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LoginIcon from "@mui/icons-material/Login";
import { useSessionExpired } from "../../contexts/SessionExpiredContext/SessionExpiredContext";

interface SessionExpiredModalProps {
  isOpen: boolean;
}

export function SessionExpiredModal({ isOpen }: SessionExpiredModalProps) {
  const sessionExpired = useSessionExpired();
  const router = useRouter();

  //Fechando a modal
  if(!isOpen){
    return null;
  } 
  
  const handleLoginRedirect = () => {
    sessionExpired.closeSessionExpired();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
        
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
          <WarningAmberIcon sx={{ fontSize: 40 }} />
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Sessão Expirada
        </h2>
        
        <p className="text-slate-600 mb-8">
          Sua sessão expirou. Por favor, realize o login novamente para continuar.
        </p>

        <button
          onClick={handleLoginRedirect}
          className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
        >
          <LoginIcon />
          Ir para o Login
        </button>
      </div>
    </div>
  );
}