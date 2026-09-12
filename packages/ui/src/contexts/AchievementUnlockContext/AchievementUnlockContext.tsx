"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

export interface AchievementPopupData {
  titulo: string;
  descricao?: string;
  urlImagem?: string;
  pontos?: number;
}

interface AchievementContextType {
  showAchievement: (achievement: AchievementPopupData) => void;
}

const AchievementContext = createContext<AchievementContextType>({
  showAchievement: () => {},
});

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [current, setCurrent] = useState<AchievementPopupData | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioUnlockedRef = useRef<boolean>(false);

  useEffect(() => {
    // Instancia o áudio no client-side
    audioRef.current = new Audio("/sounds/achivementUnlocked.mp3");

    // "Destranca" o áudio no primeiro toque/clique em qualquer lugar da tela
    const unlockAudio = () => {
      if (!audioUnlockedRef.current && audioRef.current) {
        audioRef.current.play().then(() => {
          audioRef.current?.pause();
          if (audioRef.current) audioRef.current.currentTime = 0;
          audioUnlockedRef.current = true;
        }).catch(() => {});
      }
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
    window.addEventListener("keydown", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  const showAchievement = (achievement: AchievementPopupData) => {
    // Executa a reprodução do áudio
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay impedido pelo navegador:", err);
      });
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    setCurrent(achievement);
    setIsVisible(true);

    timerRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setCurrent(null), 500);
    }, 5000);
  };

  return (
    <AchievementContext.Provider value={{ showAchievement }}>
      {children}

      {current && (
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out transform ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-10 scale-95 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-3.5 bg-slate-950/95 text-white border border-slate-700/80 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md min-w-[320px] max-w-md">
            <div className="relative w-12 h-12 rounded-xl bg-slate-800 border border-amber-500/40 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
              {current.urlImagem ? (
                <img
                  src={current.urlImagem}
                  alt={current.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl">🏆</span>
              )}
            </div>

            {/* Informações da Conquista */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">
                  Conquista Desbloqueada!
                </span>
                {current.pontos !== undefined && (
                  <span className="text-[11px] font-extrabold text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-700 shrink-0">
                    +{current.pontos} XP
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white truncate mt-0.5">
                {current.titulo}
              </h4>
              {current.descricao && (
                <p className="text-[11px] text-slate-400 truncate leading-snug">
                  {current.descricao}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </AchievementContext.Provider>
  );
};

export const useAchievement = () => useContext(AchievementContext);