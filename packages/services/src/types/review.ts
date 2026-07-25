export interface ReviewPost {
  id: number;
  fotoURL: string;
  nomeUsuario: string;
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
