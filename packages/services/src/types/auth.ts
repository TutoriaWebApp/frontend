
/**
 * Interface para a resposta do Backend (Django)
 */
export interface BackendResponse {
  mensagem: string;
  [key: string]: any; 
}

/**
 * Interface para o retorno da requisição de autenticação
 */
export interface AuthResult {
  success: boolean;
  status: number;
  data: BackendResponse;
  headers?: Headers; 
}

export interface PasswordResetRequestResult {
  success: boolean;
  status: number;
  data: BackendResponse;
}

export interface PasswordResetResult {
  success: boolean;
  status: number;
  data: BackendResponse;
}

export type ActionState = {
  success: boolean | null;
  message: string;
  email?: string;
  password?: string;
};

export interface PasswordResetResultResponse {
  success: boolean;
  message: string;
}