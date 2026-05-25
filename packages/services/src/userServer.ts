import {
  BackendResponse,
  CreateUserResponse,
  GetAreaResult,
  UserDataFailResult,
  UserDataSuccessResult,
} from "./types/user";
import { authRequestWrapper } from "@repo/lib/authRequestWrapper";
import { cookies } from "next/headers";
import { GetScheduleResult } from "./types/availability";

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

export async function GetUserData(): Promise<
  UserDataSuccessResult | UserDataFailResult
> {
  const URL = `${process.env.backendBaseURL}/perfil`;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;
  const csrfToken = cookieStore.get("csrftoken")?.value;

  const res = await authRequestWrapper(
    URL,
    {
      method: "GET",
      headers: {
        Cookie: `access_token=${accessToken}; csrftoken=${csrfToken}`,
      },
    },
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

export async function GetAreaById(id: number): Promise<GetAreaResult> {
  const URL = `${process.env.backendBaseURL}/areas/${id}/`;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;
  const csrfToken = cookieStore.get("csrftoken")?.value;

  const res = await authRequestWrapper(
    URL,
    {
      method: "GET",
      headers: {
        Cookie: `access_token=${accessToken}; csrftoken=${csrfToken}`,
      },
    },
    "Request Area By Id (Server)",
  );

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

export async function GetSchedule(): Promise<GetScheduleResult> {
  const URL = `${process.env.backendBaseURL}/agendas/`;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;
  const csrfToken = cookieStore.get("csrftoken")?.value;

  const res = await authRequestWrapper(
    URL,
    {
      method: "GET",
      headers: {
        Cookie: `access_token=${accessToken}; csrftoken=${csrfToken}`,
      },
    },
    "Request Schedules (Server)",
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
