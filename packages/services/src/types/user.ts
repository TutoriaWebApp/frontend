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