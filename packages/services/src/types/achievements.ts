export interface AllAchievements {
  id: number;
  titulo: string;
  descricao: string;
  urlImagem: string;
  pontos: number;
  secreta: boolean;
  pistaSecreta?: string;
}

export interface UserAchievements {
  titulo: string;
  descricao: string;
  urlImagem: string;
  pontos: number;
}

export interface GetAllAchievementsResult{
    success: boolean;
    status: number;
    data?: AllAchievements[];
}

export interface GetUserAchievementsResult{
    success: boolean;
    status: number;
    data?: GetUserAchievementsResult[];
}