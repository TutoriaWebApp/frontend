"use server";

import { LogIn } from "../auth";
import { ActionState, AuthResult } from "../types/auth";
import { cookies } from "next/headers";

export async function LogInAction(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, message: "Preencha e-mail e senha." };
  }

  try {
    const result: AuthResult = await LogIn(username.trim(), password);

    if (result.success) {
      const cookieStore = await cookies();
      const setCookie = result.headers?.get("set-cookie");

      if (setCookie) {
        // O Next.js repassa o cookie do Django pro navegador aqui
        console.log("Cookie de sessão capturado");
      }

      return { success: true, message: "Sucesso!" };
    }

    return {
      success: false,
      message: result.data?.mensagem || "E-mail ou senha incorretos.",
      email: username,
      password: password,
    };
  } catch (error) {
    return { 
      success: false, 
      message: "Erro de conexão com o servidor.",
      email: username,
      password: password 
    };
  }
}
