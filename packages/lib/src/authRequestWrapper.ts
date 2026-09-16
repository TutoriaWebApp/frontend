interface reqParamsData {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
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
): Promise<authRequestResponseData> => {
  try {
    const response = await fetch(URL, {
      ...reqParams,
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
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const isAuthRoute = currentPath === "/" || currentPath.startsWith("/criar-conta");
        const isLoginRequest = URL.includes("/") || URL.includes("/token");

        if (!isAuthRoute && !isLoginRequest) {
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