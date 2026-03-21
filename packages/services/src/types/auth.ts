
/**
 * Interface para a resposta do Backend (Django)
 */
export interface BackendResponse {
  mensagem: string;
  [key: string]: any; 
}

/**
 * Interface para o retorno da requisição
 */
export interface AuthResult {
  success: boolean;
  status: number;
  data: BackendResponse;
  headers?: Headers; // Necessário para capturar os cookies do Django no servidor
}


export type ActionState = {
  success: boolean | null;
  message: string;
  email?: string;
  password?: string;
};
