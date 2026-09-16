"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { GetUserAchievements } from "@repo/services/achievements";
import { GetStatistics } from "@repo/services/userClient";

interface UserAchievementsContextType {
  userId: number | null;
  achievementsStatus: boolean[];
  pontos: number;
  totalConquistasDesbloqueadas: number;
  loading: boolean;
  inicializado: boolean;

  setUserId: (id: number | null) => void;
  hasAchievement: (achievementId: number) => boolean;
  setPontos: (pontos: number) => void;
  adicionarPontos: (qtd: number) => void;
  markAchievementUnlocked: (achievementId: number, pontosGanhos?: number) => void;
  carregarDadosConquistas: (targetUserId?: number, forceRefresh?: boolean) => Promise<void>;
  resetContext: () => void;
}

const TOTAL_SLOTS = 35;

const UserAchievementsContext = createContext<UserAchievementsContextType>({
  userId: null,
  achievementsStatus: Array(TOTAL_SLOTS).fill(false),
  pontos: 0,
  totalConquistasDesbloqueadas: 0,
  loading: false,
  inicializado: false,
  setUserId: () => {},
  hasAchievement: () => false,
  setPontos: () => {},
  adicionarPontos: () => {},
  markAchievementUnlocked: () => {},
  carregarDadosConquistas: async () => {},
  resetContext: () => {},
});

export const UserAchievementsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userId, setUserIdState] = useState<number | null>(null);
  const [achievementsStatus, setAchievementsStatus] = useState<boolean[]>(() =>
    Array(TOTAL_SLOTS).fill(false)
  );
  const [pontos, setPontosState] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [inicializado, setInicializado] = useState<boolean>(false);

  const isFetchingRef = useRef(false);

  const totalConquistasDesbloqueadas = useMemo(() => {
    return achievementsStatus.filter(Boolean).length;
  }, [achievementsStatus]);

  const setUserId = useCallback((id: number | null) => {
    setUserIdState(id);
  }, []);

  const hasAchievement = useCallback(
    (achievementId: number): boolean => {
      if (achievementId <= 0 || achievementId >= TOTAL_SLOTS) return false;
      return !!achievementsStatus[achievementId];
    },
    [achievementsStatus]
  );

  const setPontos = useCallback((novosPontos: number) => {
    setPontosState(novosPontos);
  }, []);

  const adicionarPontos = useCallback((qtd: number) => {
    setPontosState((prev) => prev + qtd);
  }, []);

  const markAchievementUnlocked = useCallback(
    (achievementId: number, pontosGanhos: number = 0) => {
      if (achievementId <= 0 || achievementId >= TOTAL_SLOTS) return;

      setAchievementsStatus((prev) => {
        if (prev[achievementId]) return prev;
        const updated = [...prev];
        updated[achievementId] = true;
        return updated;
      });

      if (pontosGanhos > 0) {
        setPontosState((prev) => prev + pontosGanhos);
      }
    },
    []
  );

  const carregarDadosConquistas = useCallback(
    async (targetUserId?: number, forceRefresh: boolean = false) => {
      if (isFetchingRef.current) return;
      if (inicializado && !forceRefresh) return;

      isFetchingRef.current = true;
      setLoading(true);

      try {
        let resolvedUserId = targetUserId ?? userId;
        const statsRes = await GetStatistics();

        if (statsRes.success && statsRes.data) {
          setPontosState(statsRes.data.pontos ?? 0);
          if (!resolvedUserId && statsRes.data.usuarioId) {
            resolvedUserId = statsRes.data.usuarioId;
          }
        }

        if (resolvedUserId) {
          setUserIdState(resolvedUserId);
          const achieveRes = await GetUserAchievements(resolvedUserId);

          console.log("🔍 [UserAchievementsContext] achieveRes:", achieveRes);

          if (achieveRes.success && achieveRes.data) {
            const novoArrayStatus = Array(TOTAL_SLOTS).fill(false);
            const listaConquistas = Array.isArray(achieveRes.data)
              ? achieveRes.data
              : (achieveRes.data as any).results || [];

            listaConquistas.forEach((item: any) => {
              const id =
                item.id ??
                item.conquistaId ??
                item.conquista_id ??
                (typeof item.conquista === "object" ? item.conquista.id : item.conquista);

              const numId = Number(id);
              if (!isNaN(numId) && numId > 0 && numId < TOTAL_SLOTS) {
                novoArrayStatus[numId] = true;
              }
            });

            console.log("✅ [UserAchievementsContext] novoArrayStatus:", novoArrayStatus);
            setAchievementsStatus(novoArrayStatus);
          }
        }

        setInicializado(true);
      } catch (error) {
        console.error("Erro ao carregar dados de conquistas:", error);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [inicializado, userId]
  );

  useEffect(() => {
    carregarDadosConquistas();
  }, []);

  const resetContext = useCallback(() => {
    setUserIdState(null);
    setAchievementsStatus(Array(TOTAL_SLOTS).fill(false));
    setPontosState(0);
    setInicializado(false);
  }, []);

  return (
    <UserAchievementsContext.Provider
      value={{
        userId,
        achievementsStatus,
        pontos,
        totalConquistasDesbloqueadas,
        loading,
        inicializado,
        setUserId,
        hasAchievement,
        setPontos,
        adicionarPontos,
        markAchievementUnlocked,
        carregarDadosConquistas,
        resetContext,
      }}
    >
      {children}
    </UserAchievementsContext.Provider>
  );
};

export const useUserAchievements = () => useContext(UserAchievementsContext);