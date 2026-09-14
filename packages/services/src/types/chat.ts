export interface CreateChatData {
  tutorId: number;
  conteudo: string;
}

export interface CreateChatResult {
  success: boolean;
  status: number;
}

export interface GetChatResultData {
  id: number;
  usuarioId: number;
  nomePessoa: string;
  fotoURL: string | null;
  ultimaMensagem: string | null;
  horarioUltimaMensagem: string | null;
  mensagensNaoLidas: number;
}

export interface GetChatResult {
  success: boolean;
  status: number;
  data?: GetChatResultData[];
}

export interface PostMessageData {
  conteudo: string;
  chatId: number;
}

export interface PostMessageResult {
  success: boolean;
  status: number;
  data?: {
    id: number;
    conteudo: string;
    horario: string;
    chatId: number;
  };
}

export interface MessageGetData {
  id: number;
  chatId: number;
  usuarioId: number;
  conteudo: string;
  horario: string;
  ehMinha: boolean;
}

export interface MessagesGetResult {
  success: boolean;
  status: number;
  data?: MessageGetData[];
  hasNext?: boolean;
}

export interface ReadMessagesResult {
  success: boolean;
  status: number;
}