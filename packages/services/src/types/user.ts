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

export interface UserData{
    email: string;
    nomePerfil: string;
    estado: string;
    cidade: string;
    aniversario: string;
    pontuacao: number;
    fotoURL: string;
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