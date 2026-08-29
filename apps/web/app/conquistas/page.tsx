"use client";

import { useState } from "react";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { AchievementCard, AchievementCardItem } from "@repo/ui/AchievementCard/AchievementCard";

const MOCK_ACHIEVEMENTS: AchievementCardItem[] = [
  {
    id: 1,
    titulo: "Bem-vindo!",
    descricao: "Complete o cadastro e personalize seu perfil.",
    urlImagem: "https://picsum.photos/100?16",
    pontos: 50,
    secreta: false,
    obtida: true, // Bronze obtida
  },
  {
    id: 2,
    titulo: "A primeira de muitas!",
    descricao: "Realize sua primeira sessão de tutoria na plataforma.",
    urlImagem: "https://picsum.photos/100?6",
    pontos: 100,
    secreta: false,
    obtida: true, // Bronze obtida
  },
  {
    id: 3,
    titulo: "Explorador de Áreas",
    descricao: "Participe de sessões em 5 áreas de conhecimento diferentes.",
    urlImagem: "https://picsum.photos/100?11",
    pontos: 200,
    secreta: false,
    obtida: false, // Bronze não obtida
  },
  {
    id: 4,
    titulo: "Comunicador Nato",
    descricao: "Envie mais de 100 mensagens no chat de tutoria.",
    urlImagem: "https://picsum.photos/100?13",
    pontos: 400,
    secreta: false,
    obtida: true, // Prata obtida
  },
  {
    id: 5,
    titulo: "Tutor Experiente",
    descricao: "Complete 20 sessões como tutor com avaliação positiva.",
    urlImagem: "https://picsum.photos/100?8",
    pontos: 500,
    secreta: false,
    obtida: false, // Prata não obtida
  },
  {
    id: 6,
    titulo: "Mestre do Saber",
    descricao: "Acumule 1000 pontos em atividades na plataforma.",
    urlImagem: "https://picsum.photos/100?9",
    pontos: 1000,
    secreta: false,
    obtida: true, // Ouro obtida
  },
  {
    id: 7,
    titulo: "Sábio Lendário",
    descricao: "Acumule mais de 100 avaliações de 5 estrelas.",
    urlImagem: "https://picsum.photos/100?23",
    pontos: 1200,
    secreta: false,
    obtida: false, // Ouro não obtida
  },
  {
    id: 8,
    titulo: "Lenda Suprema",
    descricao: "Alcance o topo do ranking global com mais de 1500 pontos.",
    urlImagem: "https://picsum.photos/100?10",
    pontos: 1600,
    secreta: false,
    obtida: true, // Diamante obtida
  },
  {
    id: 9,
    titulo: "Nascimento do Conhecedor",
    descricao: "Realizou uma tutoria no dia do seu aniversário.",
    urlImagem: "https://picsum.photos/100?30",
    pontos: 300,
    secreta: true,
    pistaSecreta: "Uma tutoria em um dia muito especial para você...",
    obtida: false, // Secreta Bloqueada
  },
  {
    id: 10,
    titulo: "Coruja da Madrugada",
    descricao: "Completou uma sessão de tutoria após as 23h.",
    urlImagem: "https://picsum.photos/100?18",
    pontos: 250,
    secreta: true,
    pistaSecreta: "O conhecimento não dorme quando as estrelas brilham...",
    obtida: true, // Secreta Desbloqueada (revelada)
  },
];

export default function AchievementsPage() {
  const [conquistas] = useState<AchievementCardItem[]>(MOCK_ACHIEVEMENTS);

  const obtidasCount = conquistas.filter((c) => c.obtida).length;
  const totalPontos = conquistas
    .filter((c) => c.obtida)
    .reduce((acc, curr) => acc + curr.pontos, 0);

  return (
    <main className="
      max-w-6xl 
      mx-auto
      px-4 
      py-10
    ">
      {/* Cabeçalho */}
      <div className="
        flex 
        flex-col 
        md:flex-row 
        items-center 
        justify-between 
        gap-4 
        mb-10 
        border-b 
        border-slate-200 
        pb-6
      ">
        <div>
          <h1 className="
            text-3xl 
            font-extrabold 
            text-slate-800 
            text-center 
            md:text-left
          ">
            Conquistas
          </h1>
          <p className="
            text-slate-500 
            text-sm 
            mt-1 
            text-center 
            md:text-left
          ">
            Complete desafios e ganhe recompensas.
          </p>
        </div>

        {/* Resumo */}
        <div className="
          flex 
          items-center 
          gap-4 
          bg-white 
          border 
          border-slate-200 
          px-5 
          py-2.5 
          rounded-2xl 
          shadow-xs
        ">
          <div className="
            flex 
            items-center 
            gap-1.5 
            border-r 
            border-slate-200 
            pr-4
          ">
            <span className="
              text-slate-400 
              text-xs 
              font-bold 
              uppercase
            ">
              Progresso:
            </span>
            <span className="
              text-slate-800 
              font-extrabold 
              text-sm
            ">
              {obtidasCount} / {conquistas.length}
            </span>
          </div>
          <div className="
            flex 
            items-center 
            gap-1.5
          ">
            <EmojiEventsIcon className="text-amber-500" sx={{ fontSize: 20 }} />
            <span className="
              text-amber-600 
              font-black
              text-sm
            ">
              {totalPontos} pts
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        gap-6
      ">
        {conquistas.map((conquista) => (
          <AchievementCard 
            key={conquista.id} 
            conquista={conquista} 
          />
        ))}
      </div>
    </main>
  );
}