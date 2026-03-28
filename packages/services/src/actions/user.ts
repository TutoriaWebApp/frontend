"use server";

import { CreateAccount } from "../user";
import { CreateUserResponse, CreateUserResult } from "../types/user";

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
      message: result.data.message
    };
  } catch (error) {
    return {
      success: false,
      message: "Não foi possível conectar com o servidor."
    };
  }
}
