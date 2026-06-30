export interface SessionGetData {
  id: number;
  nomeArea: string;
  nomeEspecialidade: string;
  nomeUsuario: string;
  nomeTutor: string;
  fotoAprendizURL: string | null;
  fotoTutorURL: string | null;
  dataSessao: string;
  horarioInicio: string;
  horarioFim: string;
  usuarioId: number;
  tutorId: number;
  areaId: number;
  especialidadeId: number;
}

export interface SessionsGetResult {
  success: boolean;
  status: number;
  data?: {
    count: number;
    next: string;
    previous: string;
    results: SessionGetData[];
  };
}

export interface SpecificTutorSessionGetResult{
  success: boolean;
  status: number;
  data?: SessionGetData[];
}

export interface AllUserSessionGetResult{
  success: boolean;
  status: number;
  data?: SessionGetData[];
}

