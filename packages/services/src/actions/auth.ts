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

      const rawCookies = result.headers?.getSetCookie() || [];

      rawCookies.forEach((cookieString) => {
        const [nameValue, ...parts] = cookieString.split(";");
        const [name, value] = nameValue.split("=");

        if (name && value) {
          const options: any = {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production", // Apenas HTTPS em produção
            sameSite: "lax",
          };

          parts.forEach((part) => {
            const [key, val] = part.trim().split("=");
            const lowerKey = key.toLowerCase();

            if (lowerKey === "max-age") {
              options.maxAge = parseInt(val); 
            } else if (lowerKey === "expires") {
              options.expires = new Date(val);
            } else if (lowerKey === "path") {
              options.path = val;
            } else if (lowerKey === "samesite") {
              options.sameSite = val.toLowerCase();
            }
          });

          cookieStore.set(name.trim(), value.trim(), options);
        }
      });

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
      password: password,
    };
  }
}
