export interface ReviewPost {
  id: number;
  fotoURL: string;
  nomeUsuario: string;
  usuarioAvaliadorId: number;
  nota: number;
  comentario: string;
  tutorId: number;
  sessaoId: number;
}

export interface GetReviewsResult {
  success: boolean;
  status: number;
  data?: {
    count: number;
    next: string;
    previous: string;
    results: ReviewPost[];
  };
}

export interface GetPendingReview {
  sessaoId: number;
  dataSessao: string;
  horarioInicio: string;
  usuarioAvaliadoId: number;
  nome: string;
  fotoURL: string;
  nomeArea: string;
  nomeEspecialidade: string;
  tipoPendente: string;
}
export interface GetPendingReviewsResult {
  success: boolean;
  status: number;
  data?: GetPendingReview[];
}

export interface SendUserReviewData {
  nota: number;
  comentario: string;
  usuarioId: number;
  sessaoId: number;
}

export interface SendTutorReviewData {
  nota: number;
  comentario: string;
  tutorId: number;
  sessaoId: number;
}

export interface SendReviewResult {
  success: boolean;
  status: number;
}

export interface AllUserReviewsData{
  comoAprendiz: [{
    id: number;
    nota: number;
    comentario?: string;
  }];
  comoTutor: [{
    id: number;
    nota: number;
    comentario?: string;
  }]
}

export interface GetAllUserReviewsResult{
  success: boolean;
  status: number;
  data?: AllUserReviewsData;
}