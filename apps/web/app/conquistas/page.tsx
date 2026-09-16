"use client";

import { useContext, useEffect, useState } from "react";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {
  AchievementCard,
  AchievementCardItem,
} from "@repo/ui/AchievementCard/AchievementCard";
import { GetAllAchievements } from "@repo/services/achievements";
import { ClipLoader } from "react-spinners";
import { NotificationContext } from "@repo/ui/contexts/NotificationContext/NotificationContext";
import { useUserAchievements } from "@repo/ui/userAchievementsContext";

export default function AchievementsPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [rawAchievements, setRawAchievements] = useState<any[]>([]);
  const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_backendAchivementsBaseImageURL;
  const { showNotification } = useContext(NotificationContext);

  const {
    pontos,
    totalConquistasDesbloqueadas,
    hasAchievement,
    inicializado,
    loading: contextLoading,
  } = useUserAchievements();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const res = await GetAllAchievements();

      if (res.success && res.data) {
        setRawAchievements(res.data);
      } else {
        showNotification("Erro ao buscar conquistas.", "error");
      }

      setLoading(false);
    };

    fetchAll();
  }, [showNotification]);

  const achievements: AchievementCardItem[] = rawAchievements.map((achievement) => ({
    ...achievement,
    obtida: hasAchievement(achievement.id),
    urlImagem: `${BASE_IMAGE_URL}${achievement.urlImagem}`,
  }));

  const isPageLoading = loading || (!inicializado && contextLoading);

  return (
    <>
      {isPageLoading && (
        <ClipLoader
          color="#64748b"
          className="relative left-[47%]"
          size={120}
        />
      )}

      {!isPageLoading && (
        <main className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 text-center md:text-left">
                Conquistas
              </h1>
              <p className="text-slate-500 text-sm mt-1 text-center md:text-left">
                Complete desafios e ganhe recompensas.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl shadow-xs">
              <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                <span className="text-slate-400 text-xs font-bold uppercase">
                  Progresso:
                </span>
                <span className="text-slate-800 font-extrabold text-sm">
                  {totalConquistasDesbloqueadas} / {achievements.length}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <EmojiEventsIcon
                  className="text-amber-500"
                  sx={{ fontSize: 20 }}
                />
                <span className="text-amber-600 font-black text-sm">
                  {pontos} pts
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((conquista) => (
              <AchievementCard key={conquista.id} conquista={conquista} />
            ))}
          </div>
        </main>
      )}
    </>
  );
}