"use server";

import { cookies } from "next/headers";

import { CreateAccount } from "../userServer";
import { ChangePassword } from "../userClient";
import {
  CreateUserResponse,
  CreateUserResult,
  ChangePasswordResult,
} from "../types/user";

export async function CreateAccountAction(
  formData: FormData,
): Promise<CreateUserResult> {
  try {
    const result: CreateUserResponse = await CreateAccount(formData);

    if (result.success) {
      return { success: true, message: "Usuário criado com sucesso!" };
    }
    return {
      success: false,
      message: result.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Não foi possível conectar com o servidor.",
    };
  }
}

export async function ChangePasswordAction(
  password: string,
  newPassword: string,
): Promise<{ success: boolean; status?: number; message: string }> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const csrfToken = cookieStore.get("csrftoken")!.value;

    const cookieString = `access_token=${accessToken}; csrftoken=${csrfToken}`;

    const result: ChangePasswordResult = await ChangePassword(
      password,
      newPassword,
      cookieString,
      csrfToken,
    );

    if (result.success) {
      return { success: true, message: result.data.mensagem };
    } else {
      if (result.status === 400) {
        return {
          success: false,
          status: result.status,
          message: "A senha atual está incorreta.",
        };
      } else {
        return {
          success: false,
          status: result.status,
          message: "Ocorreu um erro ao tentar alterar a senha.",
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "Não foi possível conectar com o servidor.",
    };
  }
}
