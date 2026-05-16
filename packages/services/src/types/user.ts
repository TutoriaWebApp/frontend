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
    perfilTutor?: {
      id: number;
      especialidades: Specialty[];
    } | null;
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

export interface StudentArea {
  id: number;
  nomeArea: string;
}

export interface TutorArea {
  id: number;
  nomeArea: string;
}

export interface Specialty {
  id: number;
  nomeEspecialidade: string;
  areaId: number;
}

export interface EditProfileResult{
  success: boolean;
  status?: number;
}

export interface GetAreasResult {
  success: boolean;
  status: number;
  data: TutorArea[];
}

export interface GetAreaResult {
  success: boolean;
  status: number;
  data: TutorArea | null;
}


export interface GetSpecialtiesResult {
  success: boolean;
  status: number;
  data: Specialty[];
}

export interface BecomeTutorResult {
  success: boolean;
  status: number;
}