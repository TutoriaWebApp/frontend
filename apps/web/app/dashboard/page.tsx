"use client";

import React, { useEffect, useState, useContext, useRef } from "react";
import Link from "next/link";
import { PersonSearch, Star, EmojiEvents } from "@mui/icons-material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { DashboardCard } from "@repo/ui/dashboardCard";
import { useEvaluation } from "@repo/ui/contexts/EvaluateUserContext/EvaluateUserContext";
import { GetPendingReviews } from "@repo/services/reviews";
import { DashboardStatisticsData } from "@repo/services/userTypes";
import { GetStatistics } from "@repo/services/userClient";
import { useUserAchievements } from "@repo/ui/userAchievementsContext";
import { useUnlockAchievement } from "@repo/lib/useUnlockAchievement";
import { ClipLoader } from "react-spinners";
import { NotificationContext } from "@repo/ui/contexts/NotificationContext/NotificationContext";
import { levelThresholds, userLevel } from "@repo/lib/userLevel";
import { GetUserDataClient } from "@repo/services/userClient";
import { GetAllUserSessions } from "@repo/services/sessions";

export default function Dashboard(): React.ReactNode {
  const helloWorldAchievementId = 1;
  const becameTutorAchievementId = 23;
  const level5AchievementId = 7;
  const level10AchievementId = 14;
  const level25AchievementId = 20;
  const level50AchievementId = 22;
  const stonePathAchievement1Id = 6;
  const stonePathAchievement2Id = 12;
  const stonePathAchievement3Id = 13;
  const stonePathAchievement4Id = 18;
  const stonePathAchievement5Id = 19;
  const stonePathAchievement6Id = 21;
  const firstSessionCompletedAchievementId = 3;
  const weekendSessionAchievementId = 24;
  const nightSessionAchievementId = 25;
  const birthdaySessionAchievementId = 29;
  const fiveDayStreakAchievementId = 16;
  const loyaltyAchievementId = 10;
  const jackOfAllTradesAchievementId = 11;

  const { triggerEvaluation } = useEvaluation();
  const [statisticsData, setStatisticsData] =
    useState<DashboardStatisticsData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

  const { showNotification } = useContext(NotificationContext);

  const { unlockAchievement } = useUnlockAchievement();

  const {
    userId,
    inicializado,
    pontos,
    totalConquistasDesbloqueadas,
    setUserId,
    hasAchievement,
    carregarDadosConquistas,
  } = useUserAchievements();

  const isFetchingReviewsRef = useRef(false);

  useEffect(() => {
    async function fetchSessions() {
      if (isFetchingReviewsRef.current) return;
      isFetchingReviewsRef.current = true;

      const res = await GetPendingReviews();

      if (res.success && res.data) {
        const data = res.data;

        for (let i = 0; i < data.length; i++) {
          await triggerEvaluation(
            data[i]!.sessaoId,
            data[i]!.dataSessao,
            data[i]!.horarioInicio,
            data[i]!.nomeArea,
            data[i]!.nomeEspecialidade,
            data[i]!.nome,
            data[i]!.fotoURL,
            data[i]!.tipoPendente,
            data[i]!.usuarioAvaliadoId,
          );
        }
      }
    }

    fetchSessions();
  }, [triggerEvaluation]);

  useEffect(() => {
    sessionStorage.removeItem("is_logging_out");
  }, []);

  useEffect(() => {
    async function fetchStatistics() {
      setLoading(true);

      const res = await GetStatistics();

      if (res.success && res.data) {
        setStatisticsData(res.data);

        const currentUserId = res.data.usuarioId;
        if (currentUserId) {
          setUserId(currentUserId);
          await carregarDadosConquistas(currentUserId, true);
        }

        const currentPoints = res.data.pontos ?? 0;
        const currentLevel = userLevel(currentPoints);

        if (currentLevel >= levelThresholds.length) {
          setProgressPercentage(100);
        } else {
          const currentLevelBaseXp =
            currentLevel > 1 ? (levelThresholds[currentLevel - 2] ?? 0) : 0;
          const nextLevelTargetXp = levelThresholds[currentLevel - 1] ?? 100;

          const range = nextLevelTargetXp - currentLevelBaseXp;
          const progressInRange = currentPoints - currentLevelBaseXp;

          const percentage =
            range > 0
              ? Math.min(
                  100,
                  Math.max(0, Math.round((progressInRange / range) * 100)),
                )
              : 0;

          setProgressPercentage(percentage);
        }
      } else {
        const isLoggingOut =
          typeof window !== "undefined" &&
          sessionStorage.getItem("is_logging_out") === "true";

        if (!isLoggingOut && res.status !== 401) {
          if (res.status === 500) {
            showNotification(
              "Ocorreu um erro no servidor, não foi possível obter suas estatísticas",
              "error",
            );
          } else {
            showNotification(
              "Ocorreu um erro, não foi possível obter suas estatísticas",
              "error",
            );
          }
        }
      }

      setLoading(false);
    }

    fetchStatistics();
  }, [carregarDadosConquistas, setUserId, showNotification]);

  useEffect(() => {
    const checkAchievements = async () => {
      if (!userId || !inicializado) return;

      // Conquista 1: Olá Mundo
      unlockAchievement(helloWorldAchievementId);

      // Conquista 23: Agora é sua vez!
      if (!hasAchievement(becameTutorAchievementId)) {
        const res = await GetUserDataClient();
        if (res.success && res.data?.perfilTutor != null) {
          unlockAchievement(becameTutorAchievementId);
        }
      }

      // Conquistas baseadas em sessões concluídas:
      // Conquista 3: Primeiro Passo (1 sessão concluída)
      // Conquista 6:  O Caminho das Pedras I (5 sessões concluídas)
      // Conquista 12: O Caminho das Pedras II (15 sessões concluídas)
      // Conquista 13: O Caminho das Pedras III (30 sessões concluídas)
      // Conquista 18: O Caminho das Pedras IV (60 sessões concluídas)
      // Conquista 19: O Caminho das Pedras V (100 sessões concluídas)
      // Conquista 21: O Caminho das Pedras VI (300 sessões concluídas)
      // Conquista 24: Fim de Semana Ativo (Sábado ou Domingo)
      // Conquista 25 (Secreta): Coruja (sessão concluída entre 22h e 05h da manhã)
      // Conquista 29 (Secreta): Nascimento do Conhecimento (tutoria no aniversário)
      // Conquista 16: Incansável (sessões por 5 dias seguidos)
      // Conquista 10: Fidelidade (5 sessões com o mesmo tutor)
      // Conquista 11: Pau pra Toda Obra (deu tutoria em 3 áreas diferentes)
      if (
        !hasAchievement(firstSessionCompletedAchievementId) ||
        !hasAchievement(stonePathAchievement1Id) ||
        !hasAchievement(stonePathAchievement2Id) ||
        !hasAchievement(stonePathAchievement3Id) ||
        !hasAchievement(stonePathAchievement4Id) ||
        !hasAchievement(stonePathAchievement5Id) ||
        !hasAchievement(stonePathAchievement6Id) ||
        !hasAchievement(weekendSessionAchievementId) ||
        !hasAchievement(nightSessionAchievementId) ||
        !hasAchievement(birthdaySessionAchievementId) ||
        !hasAchievement(fiveDayStreakAchievementId) ||
        !hasAchievement(loyaltyAchievementId) ||
        !hasAchievement(jackOfAllTradesAchievementId)
      ) {
        const resSessions = await GetAllUserSessions();

        if (
          resSessions &&
          resSessions.success &&
          Array.isArray(resSessions.data)
        ) {
          const now = new Date();

          const completedSessions = resSessions.data.filter((session: any) => {
            const sessionEndDateTime = new Date(
              `${session.dataSessao}T${session.horarioFim}`,
            );
            return (
              !isNaN(sessionEndDateTime.getTime()) && sessionEndDateTime <= now
            );
          });

          // Conquista 3: completou pelo menos 1 sessão
          if (
            completedSessions.length >= 1 &&
            !hasAchievement(firstSessionCompletedAchievementId)
          ) {
            unlockAchievement(firstSessionCompletedAchievementId);
          }

          // Conquista 6: completou 5 ou mais sessões
          if (
            completedSessions.length >= 5 &&
            !hasAchievement(stonePathAchievement1Id)
          ) {
            unlockAchievement(stonePathAchievement1Id);
          }
          // Conquista 12: completou 15 ou mais sessões
          if (
            completedSessions.length >= 15 &&
            !hasAchievement(stonePathAchievement2Id)
          ) {
            unlockAchievement(stonePathAchievement2Id);
          }
          // Conquista 13: completou 30 ou mais sessões
          if (
            completedSessions.length >= 30 &&
            !hasAchievement(stonePathAchievement3Id)
          ) {
            unlockAchievement(stonePathAchievement3Id);
          }
          // Conquista 18: completou 60 ou mais sessões
          if (
            completedSessions.length >= 60 &&
            !hasAchievement(stonePathAchievement4Id)
          ) {
            unlockAchievement(stonePathAchievement4Id);
          }
          // Conquista 19: completou 100 ou mais sessões
          if (
            completedSessions.length >= 100 &&
            !hasAchievement(stonePathAchievement5Id)
          ) {
            unlockAchievement(stonePathAchievement5Id);
          }
          // Conquista 21: completou 300 ou mais sessões
          if (
            completedSessions.length >= 300 &&
            !hasAchievement(stonePathAchievement6Id)
          ) {
            unlockAchievement(stonePathAchievement6Id);
          }
          // Conquista 24: Fim de Semana Ativo (Sessão realizada no Sábado ou Domingo)
          if (!hasAchievement(weekendSessionAchievementId)) {
            const hasWeekendSession = completedSessions.some((session: any) => {
              const sessionDate = new Date(
                `${session.dataSessao}T${session.horarioInicio}`,
              );
              const dayOfWeek = sessionDate.getDay();
              return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Domingo, 6 = Sábado
            });

            if (hasWeekendSession) {
              unlockAchievement(weekendSessionAchievementId);
            }
          }
          // Conquista 25: fez uma sessão entre 22h e 05h da manhã
          if (!hasAchievement(nightSessionAchievementId)) {
            for (let session of completedSessions) {
              if (
                session.horarioInicio >= "22:00:00" ||
                session.horarioInicio <= "05:00:00" ||
                session.horarioFim >= "22:00:00" ||
                session.horarioFim <= "05:00:00"
              ) {
                unlockAchievement(nightSessionAchievementId);
                break;
              }
            }
          }
          // Conquista 29: fez uma sessão na data de nascimento
          if (!hasAchievement(birthdaySessionAchievementId)) {
            const res = await GetUserDataClient();

            if (res.success && res.data?.aniversario) {
              // Pegando "MM-DD" da data de nascimento
              const userBirthMonthDay = res.data.aniversario.slice(5);

              for (let session of completedSessions) {
                // Extrai "MM-DD" da data da sessão
                const sessionMonthDay = session.dataSessao?.slice(5);

                if (sessionMonthDay && sessionMonthDay === userBirthMonthDay) {
                  unlockAchievement(birthdaySessionAchievementId);
                  break;
                }
              }
            }
          }
          // Conquista 16: Incansável (participou de tutorias por 5 dias seguidos)
          if (!hasAchievement(fiveDayStreakAchievementId)) {
            // Extraindo datas únicas e remove duplicatas do mesmo dia
            const uniqueDates = Array.from(
              new Set(
                completedSessions.map((s: any) => s.dataSessao).filter(Boolean),
              ),
            ).sort() as string[];

            let currentStreak = 1;
            let hasFiveDayStreak = false;

            //Diferença de 1 dia em MS
            const MS_PER_DAY = 24 * 60 * 60 * 1000;

            for (let i = 1; i < uniqueDates.length; i++) {
              // Usando componentes de data para evitar distorções de fuso horário
              const [prevY, prevM, prevD] =
                uniqueDates[i - 1]!.split("-").map(Number);
              const [currY, currM, currD] =
                uniqueDates[i]!.split("-").map(Number);

              const prevTime = Date.UTC(prevY!, prevM! - 1, prevD);
              const currTime = Date.UTC(currY!, currM! - 1, currD);

              // Verificando se a diferença é de exatamente 1 dia consecutivo
              if (currTime - prevTime === MS_PER_DAY) {
                currentStreak++;
                if (currentStreak >= 5) {
                  hasFiveDayStreak = true;
                  break;
                }
              } else {
                //Recomeçando a contagem se houver uma quebra na sequência
                currentStreak = 1;
              }
            }

            if (hasFiveDayStreak) {
              unlockAchievement(fiveDayStreakAchievementId);
            }
          }

          // Conquista 10: Fidelidade (realizou 5 ou mais tutorias com o mesmo tutor)
          if (!hasAchievement(loyaltyAchievementId)) {
            const tutorCountMap: Record<number, number> = {};

            for (const session of completedSessions) {
              const tid = session.tutorId;
              if (tid != null) {
                tutorCountMap[tid] = (tutorCountMap[tid] || 0) + 1;

                if (tutorCountMap[tid]! >= 5) {
                  unlockAchievement(loyaltyAchievementId);
                  break;
                }
              }
            }
          }

          if (!hasAchievement(jackOfAllTradesAchievementId)) {
            // Sessões concluídas onde o usuário atuou como tutor
            const tutoredSessions = completedSessions.filter(
              (session: any) => session.usuarioId !== userId
            );

            // IDs das áreas dessas sessões sem repetição
            const distinctAreas = new Set(
              tutoredSessions
                .map((session: any) => session.areaId)
                .filter((areaId: any) => areaId != null)
            );

            // Se ensinou em 3 ou mais áreas distintas, destrava a conquista
            if (distinctAreas.size >= 3) {
              unlockAchievement(jackOfAllTradesAchievementId);
            }
          }

          // Conquistas de Nível
          if (userLevel(pontos) >= 5) unlockAchievement(level5AchievementId);
          if (userLevel(pontos) >= 10) unlockAchievement(level10AchievementId);
          if (userLevel(pontos) >= 25) unlockAchievement(level25AchievementId);
          if (userLevel(pontos) >= 50) unlockAchievement(level50AchievementId);
        }
      }
    };

    checkAchievements();
  }, [userId, inicializado]);

  return (
    <div className="h-fit bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
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

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10 pb-12">
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

        {loading && (
          <ClipLoader
            color="#64748b"
            className="relative left-[47%]"
            size={120}
          />
        )}

        {!loading && (
          <section className="bg-slate-50/80 mx-10 mb-10 rounded-[2rem] p-8 border border-slate-100">
            <h2 className="text-xl font-black text-slate-700 text-center mb-8">
              Seu Progresso de Aprendizado
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-center">
              <div>
                <p className="text-3xl font-black text-slate-500">
                  {statisticsData?.sessoesConcluidas ?? 0}
                </p>
                <p className="sm:text-xs 2xl:text-sm font-bold text-slate-400 uppercase mt-1">
                  Sessões Concluídas
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-purple-500">
                  {totalConquistasDesbloqueadas ||
                    (statisticsData?.conquistasDesbloqueadas ?? 0)}
                </p>
                <p className="sm:text-xs 2xl:text-sm font-bold text-slate-400 uppercase mt-1">
                  Conquistas Desbloqueadas
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-purple-500">
                  {pontos || (statisticsData?.pontos ?? 0)}
                </p>
                <p className="sm:text-xs 2xl:text-sm font-bold text-slate-400 uppercase mt-1">
                  Pontos
                </p>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden mb-4 shadow-inner">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-center text-sm font-bold text-slate-500">
                Você está{" "}
                <span className="text-purple-700">{progressPercentage}%</span>{" "}
                mais perto do seu próximo nível!
              </p>
            </div>
          </section>
        )}

        <div className="flex justify-center pb-12">
          <Link
            id="lnk-viewSolicitations"
            href="/solicitacoes"
            className="
              bg-indigo-600 
              hover:bg-indigo-700 
              text-white 
              font-bold 
              py-4
              px-3 
              md:px-10 
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
