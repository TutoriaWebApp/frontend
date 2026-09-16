import { useCallback } from "react";
import { useUserAchievements } from "../../ui/src/contexts/UserAchievementsContext/UserAchievementsContext";
import { useAchievement } from "../../ui/src/contexts/AchievementUnlockContext/AchievementUnlockContext";
import { GetSpecificAchievement } from "../../services/src/achievements";
import { UnlockAchievementAction } from "../../services/src/actions/achievements";

export const useUnlockAchievement = () => {
  const { userId, inicializado, hasAchievement, markAchievementUnlocked } =
    useUserAchievements();
  const { showAchievement } = useAchievement();

  const unlockAchievement = useCallback(
    async (achievementId: number) => {
      console.group("🔍 [DEBUG CONQUISTA] Execução useUnlockAchievement");
      console.log("userId:", userId);
      console.log("Contexto inicializado?:", inicializado);
      console.log(`Usuário já tem conquista ${achievementId}?:`, hasAchievement(achievementId));

      if (!userId) {
        console.warn("⛔ Abortado: userId ainda é nulo/indefinido.");
        console.groupEnd();
        return;
      }

      if (!inicializado) {
        console.warn("⛔ Abortado: Contexto de conquistas ainda não terminou de inicializar.");
        console.groupEnd();
        return;
      }

      if (hasAchievement(achievementId)) {
        console.warn(`⛔ Abortado: Conquista ID ${achievementId} já desbloqueada.`);
        console.groupEnd();
        return;
      }

      console.log("🚀 Disparando Server Action para ID:", achievementId);
      const resAchie = await UnlockAchievementAction(userId, achievementId);
      console.log("📥 Resposta da UnlockAchievementAction:", resAchie);

      const isNovaConquista =
        resAchie.status === 201 ||
        resAchie.data?.desbloqueadoAgora === true ||
        (resAchie.success && resAchie.data === undefined);

      if (resAchie.success && isNovaConquista) {
        const res = await GetSpecificAchievement(achievementId);

        if (res.success && res.data) {
          markAchievementUnlocked(achievementId, res.data.pontos);
          showAchievement({
            titulo: res.data.titulo,
            descricao: res.data.descricao,
            urlImagem: `${process.env.NEXT_PUBLIC_backendAchivementsBaseImageURL}${res.data.urlImagem}`,
            tier: res.data.tier,
            pontos: res.data.pontos,
          });
        }
      }
      console.groupEnd();
    },
    [userId, inicializado, hasAchievement, markAchievementUnlocked, showAchievement]
  );

  return { unlockAchievement };
};