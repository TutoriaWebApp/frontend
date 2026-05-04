"use client";

import React, { useEffect } from "react";

import Link from "next/link";

import { PersonSearch, Star, EmojiEvents } from "@mui/icons-material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { DashboardCard } from "@repo/ui/dashboardCard";

import { useEvaluation } from "@repo/ui/contexts/EvaluateUserContext/EvaluateUserContext";

export default function Dashboard(): React.ReactNode {
  const { triggerEvaluation } = useEvaluation();

  const getUnevaluatedSessions = async () => {
    const sessions = [
      {
        userId: 1,
        userName: "Lucas",
        isTutor: true,
        sessionSubject: "História",
        day: "19/05/2026",
        time: "13:00",
      },
      {
        userId: 2,
        userName: "João",
        isTutor: false,
        sessionSubject: "História",
        day: "19/05/2026",
        time: "14:00",
      },
      {
        userId: 3,
        userName: "Silas",
        isTutor: false,
        sessionSubject: "História",
        day: "19/05/2026",
        time: "15:00",
      },
      {
        userId: 4,
        userName: "Márcio",
        isTutor: true,
        sessionSubject: "História",
        day: "19/05/2026",
        time: "16:00",
      },
    ];

    return sessions;
  };

  // useEffect(() => {
  //   async function fetchSessions() {
  //     const res = await getUnevaluatedSessions();
  //     //const data = await res.json();

  //     if (res) {
  //       for (let i = 0; i < res.length; i++) {
  //         await triggerEvaluation(
  //           res[i]!.userId,
  //           res[i]!.userName,
  //           res[i]!.isTutor,
  //           res[i]!.sessionSubject,
  //           res[i]!.day,
  //           res[i]!.time,
  //         );
  //       }
  //     }
  //   }

  //   fetchSessions();
  // }, []);

  return (
    <div
      className="
        h-fit 
        bg-slate-50 
        p-6 
        md:p-12
      "
    >
      <div
        className="
        max-w-5xl 
        mx-auto 
        bg-white 
        rounded-[3rem] 
        shadow-2xl 
        shadow-slate-200/50 
        border 
        border-slate-100
      "
      >
        <section className="pt-12 pb-8 px-8 text-center">
          <h1 className="text-3xl font-black text-slate-800 mb-4">
            Bem-vindo ao{" "}
            <span className="font-montserrat font-medium">
              Tutoria
              <span className="text-brand-primary">Web</span>!
            </span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Sua plataforma para conectar-se com tutores, receber recomendações
            personalizadas e ter aprendizado gamificado envolvente.
          </p>
        </section>

        <section
          className="
          grid 
          grid-cols-1 
          md:grid-cols-3 
          gap-6 
          px-10 
          pb-12
        "
        >
          <DashboardCard
            title="Encontre um Tutor"
            description="Descubra tutores com base nas suas necessidades de aprendizado."
            buttonText="Procurar Tutores"
            icon={PersonSearch}
            colorClass="bg-blue-50/50 text-blue-600"
            btnClass="bg-blue-600 hover:bg-blue-700 shadow-blue-200"
            href="/buscar"
          />
          <DashboardCard
            title="Recomendado para Você"
            description="Recomendações personalizadas de tutores com base no seu perfil."
            buttonText="Ver Recomendações"
            icon={Star}
            colorClass="bg-emerald-50/50 text-emerald-600"
            btnClass="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
            href="/recomendacoes"
          />
          <DashboardCard
            title="Gamificação"
            description="Ganhe conquistas e pontos enquanto aprende e cresce na plataforma."
            buttonText="Minhas Conquistas"
            icon={EmojiEvents}
            colorClass="bg-purple-50/50 text-purple-600"
            btnClass="bg-purple-600 hover:bg-purple-700 shadow-purple-200"
            href="/conquistas"
          />
        </section>

        <section
          className="
          bg-slate-50/80
          mx-10 
          mb-10 
          rounded-[2rem] 
          p-8 
          border 
          border-slate-100
        "
        >
          <h2
            className="
            text-xl 
            font-black 
            text-slate-700 
            text-center 
            mb-8
          "
          >
            Seu Progresso de Aprendizado
          </h2>

          <div
            className="
            grid 
            grid-cols-3 
            gap-4 
            mb-10 
            text-center
          "
          >
            <div>
              <p
                className="
                text-3xl 
                font-black 
              text-slate-500
              "
              >
                15
              </p>
              <p
                className="
                sm:text-xs 
                2xl:text-sm 
                font-bold 
                text-slate-400 
                uppercase 
                mt-1
              "
              >
                Sessões Concluídas
              </p>
            </div>
            <div>
              <p
                className="
                text-3xl 
                font-black 
              text-purple-500
              "
              >
                8
              </p>
              <p
                className="
                sm:text-xs 
                2xl:text-sm 
                font-bold 
                text-slate-400 
                uppercase 
                mt-1
              "
              >
                Conquistas Desbloqueadas
              </p>
            </div>
            <div>
              <p
                className="
                text-3xl 
                font-black 
                text-purple-500
              "
              >
                250
              </p>
              <p
                className="
                sm:text-xs 
                2xl:text-sm 
                font-bold 
                text-slate-400 
                uppercase 
                mt-1
              "
              >
                Pontos
              </p>
            </div>
          </div>

          <div
            className="
            max-w-2xl 
            mx-auto
          "
          >
            <div
              className="
              w-full 
              h-4 
              bg-slate-200 
              rounded-full 
              overflow-hidden 
              mb-4 
              shadow-inner
            "
            >
              <div
                className="
                h-full 
                bg-purple-500 
                rounded-full 
                w-[70%] 
                transition-all 
                duration-1000 
               "
              ></div>
            </div>
            <p
              className="
              text-center 
              text-sm 
              font-bold 
              text-slate-500
            "
            >
              Você está <span className="text-purple-700">70%</span> mais perto do
              seu próximo nível!
            </p>
          </div>
        </section>

        <div
          className="
          flex 
          justify-center 
          pb-12
        "
        >
          <Link
            href="/solicitacoes"
            className="
              bg-indigo-600 
              hover:bg-indigo-700 
              text-white 
              font-bold 
              py-4 
              px-10 
              rounded-2xl 
              shadow-xl 
              shadow-indigo-100 
              transition-all 
              active:scale-95 
              flex 
              items-center 
              gap-3"
          >
            <CalendarMonthIcon />
            Ver seus agendamentos de sessões
          </Link>
        </div>
      </div>
    </div>
  );
}
