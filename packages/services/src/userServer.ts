import {
  BackendResponse,
  CreateUserResponse,
  UserDataFailResult,
  UserDataSuccessResult,
} from "./types/user";
import { authRequestWrapper } from "@repo/lib/authRequestWrapper";
import { cookies } from "next/headers";

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
      data: { mensagem: "Não foi possível conectar ao servidor." },
    };
  }
}

export async function GetUserData(): Promise<UserDataSuccessResult | UserDataFailResult> {
  const URL = `${process.env.backendBaseURL}/perfil`;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('access_token')?.value;
  const csrfToken = cookieStore.get('csrftoken')?.value;


  const res = await authRequestWrapper(
    URL,
    { method: "GET", 
      headers: {
        Cookie: `access_token=${accessToken}; csrftoken=${csrfToken}`,
      } 
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