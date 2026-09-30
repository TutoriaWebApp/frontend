import { getBackendUrl } from "@repo/lib/getBackendUrl";

interface reqParamsData {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string | undefined>;
  body?: string | FormData;
}

interface authRequestResponseData {
  success: boolean;
  status: number;
  data: any;
}

export const authRequestWrapper = async (
  URL: string,
  reqParams: reqParamsData,
  requestName: string,
  isRetry = false, // Evita loop recursivo caso o refresh retorne 401
): Promise<authRequestResponseData> => {
  try {
    const response = await fetch(URL, {
      ...reqParams,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(reqParams.headers || {}),
      },
      credentials: "include",
    });

    const contentType = response.headers.get("content-type");
    let data: any = null;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { mensagem: text || "Resposta sem formato JSON." };
    }

    if (response.status === 401) {
      const isLoginOrAuth =
        URL.includes("/login") ||
        URL.includes("/token") ||
        URL.includes("/refresh");

      // Se ainda não tentou o retry e não é rota de autenticação, tenta renovar token
      if (!isRetry && !isLoginOrAuth && typeof window !== "undefined") {
        try {
          const baseURL = getBackendUrl();
          const refreshRes = await fetch(`${baseURL}/login/refresh`, {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
            credentials: "include", // Envia o cookie 'refresh_token' automaticamente
          });

          // Se renovou o access_token, repete a requisição original
          if (refreshRes.ok) {
            return await authRequestWrapper(URL, reqParams, requestName, true);
          }
        } catch (refreshErr) {
          console.error("Erro ao tentar atualizar sessão:", refreshErr);
        }

        // Se o refresh falhou (refresh_token expirou após 3 min), desloga
        const isLoggingOut =
          sessionStorage.getItem("is_logging_out") === "true";
        const currentPath = window.location.pathname;
        const isAuthRoute =
          currentPath === "/" ||
          currentPath.startsWith("/login") ||
          currentPath.startsWith("/criar-conta") ||
          currentPath.startsWith("/esqueci-senha") ||
          currentPath.startsWith("/redefinir-senha");

        if (!isLoggingOut && !isAuthRoute) {
          window.location.href = "/?session=expired";
        }
      }

      return {
        success: false,
        status: 401,
        data,
      };
    }

    return {
      success: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error(`${requestName} Request Service Error:`, error);
    return {
      success: false,
      status: 500,
      data: { mensagem: "Não foi possível conectar ao servidor!" },
    };
  }
};
