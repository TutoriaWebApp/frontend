"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já aceitou os cookies anteriormente
    const hasAccepted = localStorage.getItem("cookiesAccepted");
    if (!hasAccepted) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-2xl border border-slate-700 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1 text-center">Privacidade e Cookies</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Utilizamos cookies essenciais para garantir o funcionamento do{" "}
            <strong>TutoriaWeb</strong>, como autenticação e segurança. Ao
            continuar navegando, você concorda com o uso dessas tecnologias
            necessárias para sua experiência.
          </p>
        </div>
        <button
          onClick={handleAccept}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-8 rounded-lg transition-colors whitespace-nowrap"
        >
          Estou Ciente
        </button>
      </div>
    </div>
  );
}
