import { BackendResponse, CreateUserResponse} from "./types/user";

export async function CreateAccount(formData: FormData): Promise<CreateUserResponse> {
  const baseURL = process.env.backendBaseURL;

  try {
    const response = await fetch(`${baseURL}/usuarios/novo`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
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