import { TimeSlot } from "./availability";
export interface BackendResponse {
  message: string;
  [key: string]: any;
}

export interface CreateUserResponse {
  success: boolean;
  status: number;
  data: BackendResponse;
}

export interface CreateUserResult {
  success: boolean;
  message: string;
}

export interface UserData {
  id: number;
  email: string;
  nomePerfil: string;
  estado: string;
  cidade: string;
  aniversario: string;
  pontuacao: number;
  fotoURL: string;
  sobremim: string;
  notaAvaliacao: number;
  totalAvaliacoes: number;
  perfilTutor?: {
    id: number;
    especialidades: Specialty[];
    areas: TutorArea[];
    notaAvaliacao: number;
    totalAvaliacoes: number;
  } | null;
}

export interface SpecificUserData {
  id: number;
  nomePerfil: string;
  estado: string;
  cidade: string;
  pontuacao: number;
  fotoURL: string;
  sobremim: string;
  notaAvaliacao: number;
  totalAvaliacoes: number;
  tutorId: number;
}

export interface UserDataSuccessResult {
  success: true;
  status: number;
  data: UserData;
}

export interface UserDataFailResult {
  success: false;
  status: number;
}

export interface ChangePasswordResult {
  success: boolean;
  status: number;
  data: BackendResponse;
}

export interface StudentArea {
  id: number;
  nomeArea: string;
}

export interface TutorArea {
  id: number;
  nomeArea: string;
}

export interface Specialty {
  id: number;
  nomeEspecialidade: string;
  areaId: number;
  contemId?: number;
}

export interface EditProfileResult {
  success: boolean;
  status?: number;
}

export interface GetAreasResult {
  success: boolean;
  status: number;
  data: TutorArea[];
}

export interface GetAreaResult {
  success: boolean;
  status: number;
  data: TutorArea | null;
}

export interface GetSpecialtiesResult {
  success: boolean;
  status: number;
  data: Specialty[];
}

export interface BecomeTutorResult {
  success: boolean;
  status: number;
  data?: {
    id: number;
    usuarioId: number;
  };
}

export interface InsertSpecialtyResult {
  success: boolean;
  status: number;
}

export interface DeleteSpecialtyResult {
  success: boolean;
  status: number;
}

export interface InsertScheduleResult {
  success: boolean;
  status: number;
}

export interface DeleteScheduleResult {
  success: boolean;
  status: number;
}

export interface TutorData {
  id: number;
  usuarioId: number;
  nomePerfil: string;
  estado: string;
  cidade: string;
  pontuacao: string;
  fotoURL: string;
  sobremim: string;
  notaAvaliacao: number;
  totalAvaliacoes: number;
  especialidades: Specialty[];
  areas: TutorArea[];
}

export interface GetTutorsResult {
  success: boolean;
  status: number;
  data?: {
    count: number;
    next: string;
    previous: string;
    results: TutorData[];
  };
}

export interface GetSpecificUserResult {
  success: boolean;
  status: number;
  data?: SpecificUserData;
}

export interface GetSpecificTutorResult {
  success: boolean;
  status: number;
  data?: TutorData;
}

export interface DashboardStatisticsData {
  sessoesConcluidas: number;
  conquistasDesbloqueadas: number;
  pontos: number;
}

export interface DashboardStatisticsResult {
  success: boolean;
  status: number;
  data?: DashboardStatisticsData;
}

export interface GetRecommendationData {
  id: number;
  score: number;
  perfilTutor: {
    id: number;
    usuarioId: number;
    nomePerfil: string;
    estado: string;
    cidade: string;
    localizacao: string;
    distancia_km: string;
    pontuacao: string;
    fotoURL: string;
    sobremim: string;
    notaAvaliacao: number;
    totalAvaliacoes: number;
    especialidades: string;
    areas: TutorArea[];
  };
}

export interface GetRecommendationsResult {
  success: boolean;
  status: number;
  data?: {
    count: number;
    next: string;
    previous: string;
    results: GetRecommendationData[];
  };
}
