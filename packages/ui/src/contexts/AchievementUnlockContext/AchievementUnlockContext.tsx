"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import Image from "next/image";
import { SparkleStar } from "../../SparkleStar/SparkleStar";

export interface AchievementPopupData {
  titulo: string;
  descricao?: string;
  urlImagem?: string;
  tier?: "B" | "P" | "O" | "D" | string;
  pontos?: number;
}

interface SparkleConfig {
  top: string;
  left: string;
  size: number;
  duration: string;
  delay: string;
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
    audioRef.current = new Audio("/sounds/achivementUnlocked.mp3");

    const unlockAudio = () => {
      if (!audioUnlockedRef.current && audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            audioRef.current?.pause();
            if (audioRef.current) audioRef.current.currentTime = 0;
            audioUnlockedRef.current = true;
          })
          .catch(() => {});
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
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay bloqueado pelo navegador:", err);
      });
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    setCurrent(achievement);
    setIsVisible(true);

    timerRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setCurrent(null), 500);
    }, 5500);
  };

  const getPopupTheme = (tier: string = "B") => {
    if (tier === "B") {
      return {
        outerFrame:
          "bg-gradient-to-br from-[#7a3e1d] via-[#d68c59] to-[#4a220e] shadow-xl shadow-[#4a220e]/40 border-2 border-[#8c481f]",
        innerPlate:
          "bg-gradient-to-b from-[#ffeedd] via-[#f7d8be] to-[#e4b593] border-[#a45a2a] shadow-inner",
        medalRim:
          "border-2 border-[#8c481f] bg-gradient-to-tr from-[#a45a2a] via-[#fbd1b0] to-[#733614] shadow-md",
        badge: "bg-[#7a3e1d] text-[#ffe6d4] border border-[#d68c59]",
        titleColor: "text-[#4a220e]",
        descColor: "text-[#6d371b]",
        pointsBadge: "bg-[#7a3e1d] text-[#ffe6d4] border border-[#a45a2a]",
        sparkleColor: "",
        sparkles: [] as SparkleConfig[],
      };
    }

    if (tier === "P") {
      return {
        outerFrame:
          "bg-gradient-to-br from-[#64748b] via-[#ffffff] to-[#334155] shadow-xl shadow-slate-400/40 border-2 border-slate-300",
        innerPlate:
          "bg-gradient-to-b from-[#ffffff] via-[#f1f5f9] to-[#cbd5e1] border-[#94a3b8] shadow-inner",
        medalRim:
          "border-2 border-[#64748b] bg-gradient-to-tr from-[#94a3b8] via-[#ffffff] to-[#475569] shadow-md",
        badge: "bg-[#475569] text-[#f8fafc] border border-slate-300",
        titleColor: "text-slate-900",
        descColor: "text-slate-600",
        pointsBadge: "bg-slate-700 text-slate-100 border border-slate-500",
        sparkleColor: "text-slate-100",
        sparkles: [
          { top: "-4px", left: "6%", size: 15, duration: "3.2s", delay: "0.1s" },
          { top: "75%", left: "92%", size: 14, duration: "3.6s", delay: "1.2s" },
          { top: "35%", left: "96%", size: 12, duration: "2.8s", delay: "0.5s" },
        ],
      };
    }

    if (tier === "O") {
      return {
        outerFrame:
          "bg-gradient-to-br from-[#92400e] via-[#fef08a] to-[#713f12] shadow-2xl shadow-amber-900/40 border-2 border-yellow-300",
        innerPlate:
          "bg-gradient-to-b from-[#fefce8] via-[#fef08a] to-[#fde047] border-[#ca8a04] shadow-inner",
        medalRim:
          "border-2 border-[#854d0e] bg-gradient-to-tr from-[#ca8a04] via-[#fef9c3] to-[#713f12] shadow-md ring-1 ring-amber-300",
        badge: "bg-[#713f12] text-[#fef08a] border border-[#fde047]",
        titleColor: "text-amber-950",
        descColor: "text-amber-900 font-medium",
        pointsBadge: "bg-[#713f12] text-[#fef08a] border border-[#ca8a04]",
        sparkleColor: "text-amber-300",
        sparkles: [
          { top: "-5px", left: "8%", size: 18, duration: "2.2s", delay: "0s" },
          { top: "10%", left: "93%", size: 15, duration: "2.4s", delay: "0.7s" },
          { top: "82%", left: "4%", size: 16, duration: "2.0s", delay: "1.1s" },
          { top: "80%", left: "90%", size: 17, duration: "2.2s", delay: "0.4s" },
          { top: "45%", left: "95%", size: 14, duration: "2.6s", delay: "1.4s" },
        ],
      };
    }

    return {
      outerFrame:
        "bg-gradient-to-br from-[#0284c7] via-[#e0f2fe] to-[#4338ca] shadow-2xl shadow-cyan-500/40 border-2 border-cyan-200",
      innerPlate:
        "bg-gradient-to-b from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd] border-[#0ea5e9] shadow-inner",
      medalRim:
        "border-2 border-[#0369a1] bg-gradient-to-tr from-[#0284c7] via-[#ffffff] to-[#38bdf8] shadow-md ring-1 ring-cyan-200",
      badge:
        "bg-gradient-to-r from-sky-600 to-indigo-600 text-white border border-cyan-200 shadow-sm",
      titleColor: "text-sky-950",
      descColor: "text-sky-900 font-medium",
      pointsBadge: "bg-sky-800 text-cyan-100 border border-cyan-300",
      sparkleColor: "text-white",
      sparkles: [
        { top: "-5px", left: "6%", size: 20, duration: "1.3s", delay: "0s" },
        { top: "-4px", left: "55%", size: 16, duration: "1.5s", delay: "0.4s" },
        { top: "10%", left: "94%", size: 18, duration: "1.2s", delay: "0.7s" },
        { top: "85%", left: "5%", size: 17, duration: "1.4s", delay: "0.3s" },
        { top: "82%", left: "92%", size: 20, duration: "1.1s", delay: "0.2s" },
        { top: "42%", left: "96%", size: 15, duration: "1.3s", delay: "0.9s" },
        { top: "45%", left: "-4px", size: 16, duration: "1.6s", delay: "0.6s" },
      ],
    };
  };

  const theme = current ? getPopupTheme(current.tier) : null;

  return (
    <AchievementContext.Provider value={{ showAchievement }}>
      {children}

      {current && theme && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out transform ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-10 scale-95 pointer-events-none"
          }`}
        >
          <div
            className={`
              relative p-2 rounded-2xl overflow-visible transition-all duration-300
              ${theme.outerFrame}
            `}
          >
            {theme.sparkles.map((sp, idx) => (
              <div
                key={idx}
                style={
                  {
                    top: sp.top,
                    left: sp.left,
                    "--twinkle-duration": sp.duration,
                    "--twinkle-delay": sp.delay,
                  } as React.CSSProperties
                }
                className="absolute pointer-events-none z-30 animate-sparkle"
              >
                <SparkleStar size={sp.size} colorClass={theme.sparkleColor} />
              </div>
            ))}

            <div
              className={`
                relative flex items-center gap-3.5 px-4 py-3 rounded-xl border-2
                min-w-[340px] max-w-md backdrop-blur-xs
                ${theme.innerPlate}
              `}
            >
              <div
                className={`
                  w-14 h-14 rounded-xl flex items-center justify-center shrink-0
                  relative overflow-hidden shadow-inner
                  ${theme.medalRim}
                `}
              >
                {current.urlImagem ? (
                  <Image
                    src={current.urlImagem}
                    alt={current.titulo}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <span className="text-2xl">🏆</span>
                )}
              </div>

              <div className="flex-1 min-w-0 pr-8">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-black tracking-widest text-stone-700/80">
                    Conquista Desbloqueada!
                  </span>
                  {current.pontos !== undefined && (
                    <span
                      className={`
                        text-[10px] font-extrabold px-1.5 py-0.2 rounded shrink-0 shadow-2xs
                        ${theme.pointsBadge}
                      `}
                    >
                      +{current.pontos} XP
                    </span>
                  )}
                </div>

                <h4
                  className={`text-sm font-black truncate mt-0.5 ${theme.titleColor}`}
                >
                  {current.titulo}
                </h4>

                {current.descricao && (
                  <p
                    className={`text-[11px] truncate leading-tight mt-0.5 ${theme.descColor}`}
                  >
                    {current.descricao}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AchievementContext.Provider>
  );
};

export const useAchievement = () => useContext(AchievementContext);