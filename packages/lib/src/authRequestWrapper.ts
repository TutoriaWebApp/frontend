interface reqParamsData {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: {};
  body?: string;
}

interface authRequestResponseData {
  success: boolean;
  status: number;
  data: any;
}

export const authRequestWrapper = async <T>(
  URL: string,
  reqParams: reqParamsData,
  requestName: string,
): Promise<authRequestResponseData> => {
  try {
    const response = await fetch(URL, {
      ...reqParams,
      credentials: "include",
    });

    const data = await response.json();

    if (response.status === 401) {
      return {
        success: false,
        status: 401,
        data,
      };
    }
    if (response.ok) {
      return { success: true, status: response.status, data };
    } else {
      return { success: false, status: response.status, data };
    }
  } catch (error) {
    console.error(`${requestName} Request Service Error:`, error);
    return {
      success: false,
      status: 500,
      data: { mensagem: "Não foi possível conectar ao servidor!" },
    };
  }
};
