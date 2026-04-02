export interface BackendResponse {
  mensagem: string;
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

export interface UserDataSuccessResult {
  success: boolean;
  data: {
    email: string;
    nomePerfil: string;
    estado: string;
    cidade: string;
    aniversario: string;
    pontuacao: number;
    fotoURL: string;
  };
}

export interface UserDataFailResult {
  success: boolean;
  status: number;
  data: BackendResponse;
}
