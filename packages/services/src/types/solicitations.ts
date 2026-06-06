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
  data?: SolicitationGetData[];
}
