export interface SolicitacaoResolvidaItem {
  id: number;
  estado: string;
  nomeArea: string;
  nomeTutor: string;
}

export interface NotificationData {
  mensagensNaoLidas: number;
  solicitacoesTutorPendentes: number;
  solicitacoesResolvidasAprendiz: SolicitacaoResolvidaItem[];
}

export interface NotificationResult {
  success: boolean;
  status: number;
  data?: NotificationData;
}