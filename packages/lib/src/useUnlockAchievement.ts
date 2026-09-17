import { useCallback } from "react";
import { useUserAchievements } from "../../ui/src/contexts/UserAchievementsContext/UserAchievementsContext";
import { useAchievement } from "../../ui/src/contexts/AchievementUnlockContext/AchievementUnlockContext";
import { GetSpecificAchievement } from "../../services/src/achievements";
import { UnlockAchievementAction } from "../../services/src/actions/achievements";
import { userLevel } from "@repo/lib/userLevel";

const level5AchievementId = 7;
const level10AchievementId = 14;
const level25AchievementId = 20;
const level50AchievementId = 22;

export const useUnlockAchievement = () => {
  const {
    userId,
    inicializado,
    pontos,
    hasAchievement,
    markAchievementUnlocked,
  } = useUserAchievements();
  const { showAchievement } = useAchievement();

  const unlockAchievement = useCallback(
    async (achievementId: number) => {
      console.group("🔍 [DEBUG CONQUISTA] Execução useUnlockAchievement");

      if (!userId || !inicializado || hasAchievement(achievementId)) {
        console.groupEnd();
        return;
      }

      console.log("🚀 Disparando Server Action para ID:", achievementId);
      const resAchie = await UnlockAchievementAction(userId, achievementId);

      const isNovaConquista =
        resAchie.status === 201 ||
        resAchie.data?.desbloqueadoAgora === true ||
        (resAchie.success && resAchie.data === undefined);

      if (resAchie.success && isNovaConquista) {
        const res = await GetSpecificAchievement(achievementId);

        if (res.success && res.data) {
          const pontosGanhos = res.data.pontos ?? 0;
          markAchievementUnlocked(achievementId, pontosGanhos);

          showAchievement({
            titulo: res.data.titulo,
            descricao: res.data.descricao,
            urlImagem: `${process.env.NEXT_PUBLIC_backendAchivementsBaseImageURL}${res.data.urlImagem}`,
            tier: res.data.tier,
            pontos: pontosGanhos,
          });

          // Verificando a conquista de Level 5 
          if (achievementId !== level5AchievementId && !hasAchievement(level5AchievementId)) {
            const novaPontuacaoTotal = pontos + pontosGanhos;
            if (userLevel(novaPontuacaoTotal) >= 5) {
              console.log("🎖️ Usuário alcançou o Nível 5! Disparando conquista...");
              // Encadeia o desbloqueio da medalha de nível 5
              unlockAchievement(level5AchievementId);
            }
          }

          // Verificando a conquista de Level 10 
          if (achievementId !== level10AchievementId && !hasAchievement(level10AchievementId)) {
            const novaPontuacaoTotal = pontos + pontosGanhos;
            if (userLevel(novaPontuacaoTotal) >= 10) {
              console.log("🎖️ Usuário alcançou o Nível 10! Disparando conquista...");
              // Encadeia o desbloqueio da medalha de nível 5
              unlockAchievement(level10AchievementId);
            }
          }
          if (achievementId !== level25AchievementId && !hasAchievement(level25AchievementId)) {
            const novaPontuacaoTotal = pontos + pontosGanhos;
            if (userLevel(novaPontuacaoTotal) >= 25) {
              console.log("🎖️ Usuário alcançou o Nível 25! Disparando conquista...");
              // Encadeia o desbloqueio da medalha de nível 5
              unlockAchievement(level25AchievementId);
            }
          }
          if (achievementId !== level50AchievementId && !hasAchievement(level50AchievementId)) {
            const novaPontuacaoTotal = pontos + pontosGanhos;
            if (userLevel(novaPontuacaoTotal) >= 50) {
              console.log("🎖️ Usuário alcançou o Nível 50! Disparando conquista...");
              // Encadeia o desbloqueio da medalha de nível 5
              unlockAchievement(level50AchievementId);
            }
          }
        }
      }
      console.groupEnd();
    },
    [
      userId,
      inicializado,
      pontos,
      hasAchievement,
      markAchievementUnlocked,
      showAchievement,
    ]
  );

  return { unlockAchievement };
};