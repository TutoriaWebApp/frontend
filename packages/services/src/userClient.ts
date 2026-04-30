import {
  UserDataFailResult,
  UserDataSuccessResult,
  ChangePasswordResult,
  EditProfileResult
} from "./types/user";
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
  csrfTokenString: string
): Promise<ChangePasswordResult> {
  const URL = `${process.env.backendBaseURL}/usuarios/altera-senha`;

  const res = await authRequestWrapper(
    URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cookie": cookieString,
        "X-CSRFToken": csrfTokenString
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
  csrfTokenString: string
): Promise<EditProfileResult> {
  const URL = `${process.env.backendBaseURL}/perfil`;

  const res = await authRequestWrapper(
    URL,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Cookie": cookieString,
        "X-CSRFToken": csrfTokenString
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
