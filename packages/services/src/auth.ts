import {
  BackendResponse,
  AuthResult,
  PasswordResetRequestResult,
  PasswordResetResult,
} from "./types/auth";

import { cookies } from "next/headers";

export async function LogIn(
  username: string,
  password: string,
): Promise<AuthResult> {
  const baseURL = process.env.backendBaseURL;

  try {
    const response = await fetch(`${baseURL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    return {
      success: response.ok,
      status: response.status,
      data: data as BackendResponse,
      headers: response.headers, // Headers para o Server Action ler o Set-Cookie
    };
  } catch (error) {
    console.error("Password Reset Request Service Error:", error);
    return {
      success: false,
      status: 500,
      data: { mensagem: "Não foi possível conectar ao servidor." },
    };
  }
}

export async function RequestPasswordReset(
  email: string,
): Promise<PasswordResetRequestResult> {
  const baseURL = process.env.backendBaseURL;

  try {
    const response = await fetch(`${baseURL}/reset-password/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    return {
      success: response.ok,
      status: response.status,
      data: data as BackendResponse,
    };
  } catch (error) {
    console.error("Password Reset Request Service Error:", error);
    return {
      success: false,
      status: 500,
      data: { mensagem: "Não foi possível conectar ao servidor." },
    };
  }
}

export async function PasswordReset(
  uid: string,
  token: string,
  new_password: string,
): Promise<PasswordResetResult> {
  const baseURL = process.env.backendBaseURL;

  try {
    const response = await fetch(`${baseURL}/reset-password/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ uid, token, new_password }),
    });

    const data = await response.json();

    return {
      success: response.ok,
      status: response.status,
      data: data as BackendResponse,
    };
  } catch (error) {
    console.error("Password Reset Service Error:", error);
    return {
      success: false,
      status: 500,
      data: { mensagem: "Não foi possível conectar ao servidor." },
    };
  }
}
