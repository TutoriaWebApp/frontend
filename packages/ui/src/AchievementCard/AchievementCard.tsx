"use client";

import React from "react";
import Image from "next/image";
import LockIcon from "@mui/icons-material/Lock";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { AllAchievements } from "@repo/services/achievementTypes";
import { SparkleStar } from "../SparkleStar/SparkleStar";

export interface AchievementCardItem extends AllAchievements {
  obtida?: boolean;
}

interface AchievementCardProps {
  conquista: AchievementCardItem;
}

interface SparkleConfig {
  top: string;
  left: string;
  size: number;
  duration: string;
  delay: string;
}

export function AchievementCard({ conquista }: AchievementCardProps) {
  const isObtained = !!conquista.obtida;
  const isSecretLocked = conquista.secreta && !isObtained;

  // Gerador de faixas e brilhos
  const getTierTheme = (pontos: number) => {
    if (!isObtained) {
      return {
        outerFrame: "bg-stone-300 border-2 border-stone-400/80 shadow-xs",
        innerPlate: "bg-stone-200/90 border-stone-400/60 shadow-inner",
        medalRim: "border-stone-400 bg-stone-300",
        badge: "bg-stone-300 text-stone-600 border border-stone-400",
        label: "Bloqueada",
        pointColor: "text-stone-500",
        sparkleColor: "",
        sparkles: [] as SparkleConfig[],
      };
    }

    // 1. Bronze: Sem brilhos
    if (pontos <= 200) {
      return {
        outerFrame:
          "bg-gradient-to-br from-[#7a3e1d] via-[#d68c59] to-[#4a220e] shadow-md shadow-[#4a220e]/30 border-2 border-[#8c481f]",
        innerPlate:
          "bg-gradient-to-b from-[#ffeedd] via-[#f7d8be] to-[#e4b593] border-[#a45a2a] shadow-inner",
        medalRim:
          "border-4 border-[#8c481f] bg-gradient-to-tr from-[#a45a2a] via-[#fbd1b0] to-[#733614] shadow-md",
        badge: "bg-[#7a3e1d] text-[#ffe6d4] border border-[#d68c59]",
        label: "Bronze",
        pointColor: "text-[#7a3e1d]",
        sparkleColor: "",
        sparkles: [] as SparkleConfig[],
      };
    }

    // 2. Prata: Poucos brilhos prateados/claros ocasionais
    if (pontos <= 700) {
      return {
        outerFrame:
          "bg-gradient-to-br from-[#64748b] via-[#ffffff] to-[#334155] shadow-lg shadow-slate-400/40 border-2 border-slate-300",
        innerPlate:
          "bg-gradient-to-b from-[#ffffff] via-[#f1f5f9] to-[#cbd5e1] border-[#94a3b8] shadow-inner",
        medalRim:
          "border-4 border-[#64748b] bg-gradient-to-tr from-[#94a3b8] via-[#ffffff] to-[#475569] shadow-md",
        badge: "bg-[#475569] text-[#f8fafc] border border-slate-300",
        label: "Prata",
        pointColor: "text-slate-700",
        sparkleColor: "text-slate-100",
        sparkles: [
          { top: "6%", left: "8%", size: 16, duration: "3.8s", delay: "0.2s" },
          {
            top: "82%",
            left: "88%",
            size: 14,
            duration: "4.2s",
            delay: "1.8s",
          },
          {
            top: "45%",
            left: "94%",
            size: 12,
            duration: "3.5s",
            delay: "0.9s",
          },
        ],
      };
    }

    // 3. Ouro: Quantidade média, frequentes e dourados
    if (pontos <= 1500) {
      return {
        outerFrame:
          "bg-gradient-to-br from-[#92400e] via-[#fef08a] to-[#713f12] shadow-xl shadow-amber-900/30 border-2 border-yellow-300",
        innerPlate:
          "bg-gradient-to-b from-[#fefce8] via-[#fef08a] to-[#fde047] border-[#ca8a04] shadow-inner",
        medalRim:
          "border-4 border-[#854d0e] bg-gradient-to-tr from-[#ca8a04] via-[#fef9c3] to-[#713f12] shadow-lg ring-1 ring-amber-300",
        badge: "bg-[#713f12] text-[#fef08a] border border-[#fde047]",
        label: "Ouro",
        pointColor: "text-amber-900 font-black",
        sparkleColor: "text-amber-300",
        sparkles: [
          { top: "4%", left: "10%", size: 20, duration: "2.2s", delay: "0s" },
          {
            top: "12%",
            left: "85%",
            size: 16,
            duration: "2.6s",
            delay: "0.8s",
          },
          {
            top: "88%",
            left: "14%",
            size: 17,
            duration: "2.1s",
            delay: "1.4s",
          },
          {
            top: "84%",
            left: "86%",
            size: 22,
            duration: "2.4s",
            delay: "0.5s",
          },
          { top: "50%", left: "4%", size: 14, duration: "2.8s", delay: "1.1s" },
          {
            top: "42%",
            left: "93%",
            size: 15,
            duration: "2.0s",
            delay: "1.7s",
          },
        ],
      };
    }

    // 4. Diamante: Muitos brilhos brancos rápidos e reluzentes
    return {
      outerFrame:
        "bg-gradient-to-br from-[#0284c7] via-[#e0f2fe] to-[#4338ca] shadow-2xl shadow-cyan-500/40 border-2 border-cyan-200",
      innerPlate:
        "bg-gradient-to-b from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd] border-[#0ea5e9] shadow-inner",
      medalRim:
        "border-4 border-[#0369a1] bg-gradient-to-tr from-[#0284c7] via-[#ffffff] to-[#38bdf8] shadow-xl ring-2 ring-cyan-200",
      badge:
        "bg-gradient-to-r from-sky-600 to-indigo-600 text-white border border-cyan-200 shadow-md",
      label: "Diamante",
      pointColor: "text-sky-950 font-black",
      sparkleColor: "text-white",
      sparkles: [
        { top: "3%", left: "6%", size: 22, duration: "1.4s", delay: "0s" },
        { top: "6%", left: "48%", size: 16, duration: "1.6s", delay: "0.3s" },
        { top: "4%", left: "90%", size: 20, duration: "1.3s", delay: "0.8s" },
        { top: "90%", left: "8%", size: 19, duration: "1.7s", delay: "0.5s" },
        { top: "92%", left: "55%", size: 15, duration: "1.5s", delay: "1.1s" },
        { top: "88%", left: "88%", size: 24, duration: "1.2s", delay: "0.2s" },
        { top: "30%", left: "3%", size: 16, duration: "1.8s", delay: "0.9s" },
        { top: "68%", left: "4%", size: 18, duration: "1.4s", delay: "0.6s" },
        { top: "35%", left: "94%", size: 17, duration: "1.5s", delay: "0.4s" },
        { top: "65%", left: "95%", size: 21, duration: "1.3s", delay: "1.0s" },
      ],
    };
  };

  const theme = getTierTheme(conquista.pontos);

  return (
    <div
      className={`
        relative 
        p-2.5 
        rounded-2xl 
        transition-all 
        duration-300 
        overflow-hidden
        ${theme.outerFrame}
        ${isObtained ? "hover:-translate-y-1 hover:scale-[1.01]" : ""}
      `}
    >
      {/* Camada de Partículas/Brilhos posicionadas na moldura */}
      {isObtained &&
        theme.sparkles.map((sp, idx) => (
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
            className="
              absolute 
              pointer-events-none 
              z-30 
              animate-sparkle
            "
          >
            <SparkleStar size={sp.size} colorClass={theme.sparkleColor} />
          </div>
        ))}

      {/* Placa Rebaixada */}
      <div
        className={`
            relative 
            flex 
            flex-col 
            items-center 
            text-center
            p-5 
            rounded-xl 
            border-2
          ${theme.innerPlate}
        `}
      >
        {/* Selo */}
        <div className="
          absolute 
          top-3 
          right-3
        ">
          <span
            className={`
              text-[10px] 
              font-black 
              px-2.5 
              py-0.5 
              rounded-md 
              uppercase 
              tracking-wider 
              ${theme.badge}
            `}
          >
            {isSecretLocked ? "Secreta" : theme.label}
          </span>
        </div>

        {/* Emblema */}
        <div
          className={`
              w-24 
              h-24 
              mb-3 
              rounded-2xl 
              flex 
              items-center 
              justify-center 
              relative 
              overflow-hidden 
              transition-all 
              duration-300
            ${theme.medalRim}
          `}
        >
          {isSecretLocked ? (
            <LockIcon
              sx={{ fontSize: 44 }}
              className="
                text-stone-600 
                drop-shadow
              "
            />
          ) : (
            <Image
              src={conquista.urlImagem}
              alt={conquista.titulo}
              fill
              unoptimized
              className={`
                object-cover 
                transition-all 
                duration-300
                ${isObtained ? `
                  grayscale-0 
                  opacity-100 
                  drop-shadow-md` : 
                  `grayscale 
                  opacity-30`
                }
              `}
            />
          )}
        </div>

        {/* Título */}
        <h3
          className={`
            text-base 
            font-extrabold 
            tracking-tight 
            mb-1
            ${isObtained ? `
              text-stone-900 
              drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]` : 
              `text-stone-500`
            }
          `}
        >
          {isSecretLocked ? "Conquista Secreta" : conquista.titulo}
        </h3>

        {/* Pontuação */}
        <div className="
          flex 
          items-center 
          gap-1 
          mb-2.5
        ">
          <EmojiEventsIcon
            sx={{ fontSize: 17 }}
            className={isObtained ? "text-amber-700" : "text-stone-400"}
          />
          <span
            className={`
                text-xs 
                uppercase 
                tracking-wider 
                ${theme.pointColor}
              `}
          >
            {isSecretLocked ? "??? pts" : `+${conquista.pontos} pts`}
          </span>
        </div>

        {/* Descrição ou Pista */}
        <p
          className={`
            text-xs 
            leading-relaxed
            ${
              isSecretLocked
                ? `italic 
                text-stone-700 
                font-semibold 
                bg-white/70 
                p-2.5 
                rounded-lg 
                border 
                border-dashed
                border-stone-400 
                w-full`
                : isObtained
                ?   "text-stone-800 font-medium"
                  : "text-stone-500 font-normal"
            }
          `}
        >
          {isSecretLocked
            ? `💡 Pista: "${conquista.pistaSecreta || "Descubra interagindo na plataforma..."}"`
            : conquista.descricao}
        </p>
      </div>
    </div>
  );
}
