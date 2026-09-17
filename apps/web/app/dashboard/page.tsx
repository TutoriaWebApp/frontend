"use client";

import React, { useEffect, useState, useContext } from "react";
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
import { useAchievement } from "@repo/ui/achievementUnlockContext";
import { ClipLoader } from "react-spinners";
import { NotificationContext } from "@repo/ui/contexts/NotificationContext/NotificationContext";
import { levelThresholds, userLevel } from "@repo/lib/userLevel";
import { GetUserDataClient } from "@repo/services/userClient";

export default function Dashboard(): React.ReactNode {
  const level5AchievementId = 7;
  const level10AchievementId = 14;
  const level25AchievementId = 20;
  const level50AchievementId = 22;

  const { triggerEvaluation } = useEvaluation();
  const [statisticsData, setStatisticsData] =
    useState<DashboardStatisticsData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

  const { showNotification } = useContext(NotificationContext);
  const { showAchievement } = useAchievement();

  const { unlockAchievement } = useUnlockAchievement();

  const {
    userId,
    inicializado,
    pontos,
    totalConquistasDesbloqueadas,
    setUserId,
    hasAchievement,
    carregarDadosConquistas,
    markAchievementUnlocked,
  } = useUserAchievements();

  useEffect(() => {
    async function fetchSessions() {
      const res = await GetPendingReviews();

      if (res.success && res.data) {
        const data = res.data;

        if (res.data.length >= 1) {
          if (!hasAchievement(3)) {
            unlockAchievement(3);
          }
        }

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

      setLoading(false);
    }

    fetchStatistics();
  }, [carregarDadosConquistas, setUserId, showNotification]);

  useEffect(() => {
    const checkAchievements = async () => {
      if (userId && inicializado) {
        unlockAchievement(1);

        if (!hasAchievement(23)) {
          const res = await GetUserDataClient();

          if (res.success && res.data.perfilTutor != null) {
            unlockAchievement(23);
          }
        }
        //Verificando conquista de Level 5
        if (userLevel(pontos) >= 5) {
          unlockAchievement(level5AchievementId);
        }
        //Verificando conquista de Level 10
        if (userLevel(pontos) >= 10) {
          unlockAchievement(level10AchievementId);
        }
        //Verificando conquista de Level 25
        if (userLevel(pontos) >= 25) {
          unlockAchievement(level25AchievementId);
        }
         //Verificando conquista de Level 50
        if (userLevel(pontos) == 50) {
          unlockAchievement(level50AchievementId);
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
