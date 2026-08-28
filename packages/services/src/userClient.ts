import {
  UserDataFailResult,
  UserDataSuccessResult,
  ChangePasswordResult,
  EditProfileResult,
  GetAreasResult,
  GetAreaResult,
  GetSpecialtiesResult,
  BecomeTutorResult,
  InsertSpecialtyResult,
  DeleteSpecialtyResult,
  InsertScheduleResult,
  DeleteScheduleResult,
  GetTutorsResult,
  BackendResponse,
  CreateUserResponse,
  GetSpecificUserResult,
  DashboardStatisticsResult,
  GetRecommendationsResult
} from "./types/user";
import { GetScheduleResult, TimeSlot } from "./types/availability";
import { authRequestWrapper } from "@repo/lib/authRequestWrapper";

export async function GetUserDataClient(): Promise<
  UserDataSuccessResult | UserDataFailResult
> {
  const URL = `${process.env.backendBaseURL}/perfil`;

  const res = await authRequestWrapper(
    URL,
    { method: "GET" },
    "Request User Data",
  );

  if (res.success) {
    const userData: UserDataSuccessResult = {
      success: true,
      status: res.status,
      data: res.data,
    };
    return userData;
  } else {
    const failedRequest: UserDataFailResult = {
      success: false,
      status: res.status,
    };
    return failedRequest;
  }
}

export async function ChangePassword(
  password: string,
  newPassword: string,
  cookieString: string,
  csrfTokenString: string | undefined,
): Promise<ChangePasswordResult> {
  const URL = `${process.env.backendBaseURL}/usuarios/altera-senha`;

  const res = await authRequestWrapper(
    URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: cookieString,
        "X-CSRFToken": csrfTokenString,
      },
      body: JSON.stringify({ senhaAntiga: password, senhaAtual: newPassword }),
    },
    "Change Password",
  );

  if (res.success) {
    const sucessRequest: ChangePasswordResult = {
      success: true,
      status: res.status,
      data: res.data,
    };
    return sucessRequest;
  } else {
    const failedRequest: ChangePasswordResult = {
      success: false,
      status: res.status,
      data: res.data,
    };
    return failedRequest;
  }
}

export async function EditProfile(
  formData: FormData,
  cookieString: string,
  csrfTokenString: string | undefined,
): Promise<EditProfileResult> {
  const URL = `${process.env.backendBaseURL}/perfil`;

  const res = await authRequestWrapper(
    URL,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Cookie: cookieString,
        "X-CSRFToken": csrfTokenString,
      },
      body: formData,
    },
    "Edit Profile",
  );

  if (res.success) {
    const sucessRequest: EditProfileResult = {
      success: true,
      status: res.status,
    };
    return sucessRequest;
  } else {
    const failedRequest: EditProfileResult = {
      success: false,
      status: res.status,
    };
    return failedRequest;
  }
}

export async function GetAreas(): Promise<GetAreasResult> {
  const URL = `${process.env.backendBaseURL}/areas/`;

  const res = await authRequestWrapper(URL, { method: "GET" }, "Request Areas");

  if (res.success) {
    const areasData: GetAreasResult = {
      success: true,
      status: res.status,
      data: res.data,
    };
    return areasData;
  } else {
    const failedRequest: GetAreasResult = {
      success: false,
      status: res.status,
      data: [],
    };
    return failedRequest;
  }
}

export async function GetAreaById(id: number): Promise<GetAreaResult> {
  const URL = `${process.env.backendBaseURL}/areas/${id}/`;

  const res = await authRequestWrapper(URL, { method: "GET" }, "Request Areas");

  if (res.success) {
    const areasData: GetAreaResult = {
      success: true,
      status: res.status,
      data: res.data,
    };
    return areasData;
  } else {
    const failedRequest: GetAreaResult = {
      success: false,
      status: res.status,
      data: null,
    };
    return failedRequest;
  }
}

export async function GetSpecialties(
  areaId?: number,
): Promise<GetSpecialtiesResult> {
  let URL = `${process.env.backendBaseURL}/especialidades/`;

  if (areaId) {
    URL += `?area=${areaId}`;
  }

  const res = await authRequestWrapper(
    URL,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
    "Request Specialties",
  );

  if (res.success) {
    const specialtiesData: GetSpecialtiesResult = {
      success: true,
      status: res.status,
      data: res.data,
    };
    return specialtiesData;
  } else {
    const failedRequest: GetSpecialtiesResult = {
      success: false,
      status: res.status,
      data: [],
    };
    return failedRequest;
  }
}

export async function BecomeTutor(
  cookieString: string,
  csrfTokenString: string | undefined,
): Promise<BecomeTutorResult> {
  const URL = `${process.env.backendBaseURL}/tutores/`;

  const res = await authRequestWrapper(
    URL,
    {
      method: "POST",
      headers: {
        Cookie: cookieString,
        "X-CSRFToken": csrfTokenString,
      },
    },
    "Request Become Tutor",
  );

  if (res.success) {
    const successBecomeTutor: BecomeTutorResult = {
      success: true,
      status: res.status,
      data: res.data,
    };
    return successBecomeTutor;
  } else {
    const failedRequest: BecomeTutorResult = {
      success: false,
      status: res.status,
    };
    return failedRequest;
  }
}

export async function InsertSpecialty(
  cookieString: string,
  csrfTokenString: string | undefined,
  specialtyId: number,
  tutorId: number,
): Promise<InsertSpecialtyResult> {
  const URL = `${process.env.backendBaseURL}/contem/`;

  const res = await authRequestWrapper(
    URL,
    {
      method: "POST",
      headers: {
        Cookie: cookieString,
        "X-CSRFToken": csrfTokenString,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ especialidadeId: specialtyId, tutorId: tutorId }),
    },
    "Request Insert Specialty",
  );

  if (res.success) {
    const successBecomeTutor: InsertSpecialtyResult = {
      success: true,
      status: res.status,
    };
    return successBecomeTutor;
  } else {
    const failedRequest: InsertSpecialtyResult = {
      success: false,
      status: res.status,
    };
    return failedRequest;
  }
}

export async function DeleteSpecialty(
  cookieString: string,
  csrfTokenString: string | undefined,
  relationId: number,
): Promise<DeleteSpecialtyResult> {
  const URL = `${process.env.backendBaseURL}/contem/${relationId}/`;

  const res = await authRequestWrapper(
    URL,
    {
      method: "DELETE",
      headers: {
        Cookie: cookieString,
        "X-CSRFToken": csrfTokenString,
      },
    },
    "Request Delete Specialty",
  );

  if (res.success) {
    const successBecomeTutor: DeleteSpecialtyResult = {
      success: true,
      status: res.status,
    };
    return successBecomeTutor;
  } else {
    const failedRequest: DeleteSpecialtyResult = {
      success: false,
      status: res.status,
    };
    return failedRequest;
  }
}

export async function GetSchedule(tutorId?: number): Promise<GetScheduleResult> {
  let URL = `${process.env.backendBaseURL}/agendas/`;

  if (tutorId) {
    URL += `?tutor=${tutorId}`;
  }
  
  const res = await authRequestWrapper(
    URL,
    {
      method: "GET",
    },
    "Request Get Schedule",
  );

  if (res.success) {
    const successBecomeTutor: GetScheduleResult = {
      success: true,
      status: res.status,
      data: res.data,
    };
    return successBecomeTutor;
  } else {
    const failedRequest: GetScheduleResult = {
      success: false,
      status: res.status,
    };
    return failedRequest;
  }
}

export async function InsertSchedule(
  cookieString: string,
  csrfTokenString: string | undefined,
  scheduleData: TimeSlot,
  tutorId: number,
): Promise<InsertScheduleResult> {
  const URL = `${process.env.backendBaseURL}/agendas/`;

  const res = await authRequestWrapper(
    URL,
    {
      method: "POST",
      headers: {
        Cookie: cookieString,
        "X-CSRFToken": csrfTokenString,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ ...scheduleData, tutorId: tutorId }),
    },
    "Request Insert Schedule",
  );

  if (res.success) {
    const successBecomeTutor: InsertScheduleResult = {
      success: true,
      status: res.status,
    };
    return successBecomeTutor;
  } else {
    const failedRequest: InsertScheduleResult = {
      success: false,
      status: res.status,
    };
    return failedRequest;
  }
}

export async function DeleteSchedule(
  cookieString: string,
  csrfTokenString: string | undefined,
  scheduleId: number,
): Promise<DeleteScheduleResult> {
  const URL = `${process.env.backendBaseURL}/agendas/${scheduleId}/`;

  const res = await authRequestWrapper(
    URL,
    {
      method: "DELETE",
      headers: {
        Cookie: cookieString,
        "X-CSRFToken": csrfTokenString,
      },
    },
    "Request Delete Specialty",
  );

  if (res.success) {
    const successBecomeTutor: DeleteScheduleResult = {
      success: true,
      status: res.status,
    };
    return successBecomeTutor;
  } else {
    const failedRequest: DeleteScheduleResult = {
      success: false,
      status: res.status,
    };
    return failedRequest;
  }
}

export async function GetTutors(
  pageNumber: number = 1,
  gradeOrder: string,
  sessionsOrder: string,
  areaId?: number,
  specialtyId?: number,
  radius?: number | string,
  page_size: number = 6
): Promise<GetTutorsResult> {
  let URL = `${process.env.backendBaseURL}/tutores/?page=${pageNumber}`;

  if (areaId) {
    URL += `&area=${areaId}`;
  }
  if (specialtyId) {
    URL += `&especialidade=${specialtyId}`;
  }
  if (radius) {
    URL += `&raio=${radius}`;
  }
  if(gradeOrder != ""){
    URL += `&ordenar_nota=${gradeOrder}`
  }
  if(sessionsOrder != ""){
    URL += `&ordenar_tutorias=${sessionsOrder}`
  }
  
  URL += `&page_size=${page_size}`;

  const res = await authRequestWrapper(
    URL,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
    "Request Tutors",
  );

  if (res.success) {
    const successGetRelations: GetTutorsResult = {
      success: true,
      status: res.status,
      data: res.data,
    };
    return successGetRelations;
  } else {
    const failedRequest: GetTutorsResult = {
      success: false,
      status: res.status,
    };
    return failedRequest;
  }
}

export async function GetRecommendations(
  pageNumber: number = 1,
  areaId: number,
  specialtyId?: number,
  radius?: number | string,
  page_size: number = 6
): Promise<GetRecommendationsResult> {
  let URL = `${process.env.backendBaseURL}/recomendacoes/?page=${pageNumber}&area=${areaId}&page_size=${page_size}`;

  if (specialtyId) {
    URL += `&especialidade=${specialtyId}`;
  }
  if (radius) {
    URL += `&raio=${radius}`;
  }
  
  const res = await authRequestWrapper(
    URL,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
    "Request Recommendation Tutors",
  );

  if (res.success) {
    const successGetRelations: GetRecommendationsResult = {
      success: true,
      status: res.status,
      data: res.data,
    };
    return successGetRelations;
  } else {
    const failedRequest: GetRecommendationsResult = {
      success: false,
      status: res.status,
    };
    return failedRequest;
  }
}


export async function CreateAccount(
  formData: FormData,
): Promise<CreateUserResponse> {
  const baseURL = process.env.backendBaseURL;

  try {
    const response = await fetch(`${baseURL}/usuarios/novo`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    const data = await response.json();

    return {
      success: response.ok,
      status: response.status,
      data: data as BackendResponse,
    };
  } catch (error) {
    console.error("Create User Request Service Error:", error);
    return {
      success: false,
      status: 500,
      data: { message: "Não foi possível conectar ao servidor." },
    };
  }
}

export async function GetSpecificUserData(userId?: number): Promise<GetSpecificUserResult> {
  let URL = `${process.env.backendBaseURL}/usuarios/${userId}`;

  const res = await authRequestWrapper(
    URL,
    {
      method: "GET",
    },
    "Request Specific User Data (Client)",
  );

  if (res.success) {
    const successUserData: GetSpecificUserResult = {
      success: true,
      status: res.status,
      data: res.data,
    };
    return successUserData;
  } else {
    const failedRequest: GetSpecificUserResult = {
      success: false,
      status: res.status,
    };
    return failedRequest;
  }
}

export async function GetStatistics(): Promise<DashboardStatisticsResult> {
  let URL = `${process.env.backendBaseURL}/estatistica`;

  const res = await authRequestWrapper(
    URL,
    {
      method: "GET",
    },
    "Request Statistics",
  );

  if (res.success) {
    const successUserData: DashboardStatisticsResult = {
      success: true,
      status: res.status,
      data: res.data,
    };
    return successUserData;
  } else {
    const failedRequest: DashboardStatisticsResult = {
      success: false,
      status: res.status,
    };
    return failedRequest;
  }
}