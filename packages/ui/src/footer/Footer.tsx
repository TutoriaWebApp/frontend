import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // Ver com o Rodrigo como fica melhor
    <footer className="bg-slate-50 border-t border-slate-200 pt-12 pb-8 px-8 mt-auto">
      {/* <div className="max-w-7xl mx-auto grid grid-cols-2 gap-12">
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
            <span className="font-black text-xl text-slate-900 tracking-tight">
              Tutoria<span className="text-brand-primary">Web</span>
            </span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
            Plataforma gamificada focada no encontro de tutores com aprendizes.
          </p>
        </div>

        <div>
          <h4 className="text-slate-900 font-bold text-sm uppercase tracking-widest mb-4">
            Desenvolvido por
          </h4>
          <ul className="text-slate-600 text-sm space-y-2">
            <li>Lucas de Lima Spinosa dos Santos</li>
            <li>Rodrigo Carvalho dos Santos</li>
            <li className="pt-2 text-slate-400 italic">
            </li>
          </ul>
        </div>

      </div> */}

      {/* <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200 flex justify-center items-center"> */}
        <p className="text-slate-400 text-xs text-center">
          &copy; {currentYear} TutoriaWeb. Todos os direitos reservados.
        </p>
      {/* </div> */}
    </footer>
  );
}
