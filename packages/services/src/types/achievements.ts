export interface AllAchievements {
  id: number;
  titulo: string;
  descricao: string;
  urlImagem: string;
  pontos: number;
  tier: string;
  secreta: true;
  pista: string;
}

export interface UserAchievements {
  id: number;
  titulo: string;
  descricao: string;
  urlImagem: string;
  pontos: number;
}

export interface GetAllAchievementsResult {
  success: boolean;
  status: number;
  data?: AllAchievements[];
}

export interface GetSpecificAchievementsResult {
  success: boolean;
  status: number;
  data?: {
    id: number;
    titulo: string;
    descricao: string;
    urlImagem: string;
    pontos: number;
  };
}

export interface GetUserAchievementsResult {
  success: boolean;
  status: number;
  data?: UserAchievements[];
}

export interface AchivementUnlockedResult {
  success: boolean;
  status: number;
  data?: {
    id: number;
    dataObtido: string;
    usuarioId: number;
    conquistaId: number;
  };
}
