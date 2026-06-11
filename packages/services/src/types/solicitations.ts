export interface SolicitationPostData {
  dataPretendida: string;
  recorrente: boolean;
  estado: "PENDENTE" | "ACEITO" | "RECUSADO";
  agendaId: number;
  areaId: number;
  especialidadeId: number;
}

export interface SolicitationGetData {
  id: number;
  nomeArea: string;
  nomeEspecialidade: string;
  nomeUsuario: string;
  nomeTutor: string;
  horarioInicio: string;
  horarioFim: string;
  fotoAprendizURL: string;
  fotoTutorURL: string;
  dataCriacao: string;
  dataPretendida: string;
  validade: string;
  recorrente: boolean;
  estado: "PENDENTE" | "ACEITO" | "RECUSADO";
  agendaId: number;
  areaId: number;
  especialidadeId: number;
}

export interface SolicitationPostResult {
  success: boolean;
  status: number;
}

export interface SolicitationGetResult {
  success: boolean;
  status: number;
  data?: {
    count: number;
    next: string;
    previous: string;
    results: [SolicitationGetData];
  };
}

export interface SolicitationPatchResult {
  success: boolean;
  status: number;
}
