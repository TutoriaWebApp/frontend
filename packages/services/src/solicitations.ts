import { authRequestWrapper } from "@repo/lib/authRequestWrapper";
import {
  SolicitationGetResult,
  SolicitationPostData,
  SolicitationPostResult,
  SolicitationPatchResult,
  AllSolicitationsGetResult
} from "./types/solicitations";

export async function CreateSolicitation(
  bodyData: SolicitationPostData,
  cookieString: string,
  csrfTokenString: string,
): Promise<SolicitationPostResult> {
  const URL = `${process.env.backendBaseURL}/solicitacoes/`;

  try {
    const res = await authRequestWrapper(
      URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: cookieString,
          "X-CSRFToken": csrfTokenString,
        },
        body: JSON.stringify(bodyData),
      },
      "Create Solicitation",
    );

    if (res.success) {
      return {
        success: res.success,
        status: res.status,
      };
    } else {
      return {
        success: false,
        status: res.status,
      };
    }
  } catch (e) {
    console.error("Create Solicitation Request Error:", e);

    return {
      success: false,
      status: 500,
    };
  }
}

export async function GetSolicitations(
  areaId?: number,
  specialtyId?: number,
  order?: string,
  type?: string,
  pageNumber: number = 1,
  page_size: number = 6,
): Promise<SolicitationGetResult> {
  let URL = `${process.env.backendBaseURL}/solicitacoes/?page=${pageNumber}`;

  if (areaId) {
    URL += `&area=${areaId}`;
  }
  if (specialtyId) {
    URL += `&especialidade=${specialtyId}`;
  }
  if (order) {
    URL += `&ordem=${order}`;
  }
  if (type) {
    URL += `&tipo=${type}`;
  }
  
  URL += `&page_size=${page_size}`;
  try {
    const res = await authRequestWrapper(
      URL,
      { method: "GET" },
      "Request Solicitations Data",
    );

    if (res.success) {
      return {
        success: true,
        status: res.status,
        data: res.data,
      };
    } else {
      return {
        success: false,
        status: res.status,
      };
    }
  } catch (e) {
    return {
      success: false,
      status: 500,
    };
  }
}

export async function GetAllSolicitations(): Promise<AllSolicitationsGetResult> {
  const URL = `${process.env.backendBaseURL}/todas-solicitacoes/`;

  try {
    const res = await authRequestWrapper(
      URL,
      { method: "GET" },
      "Request All Solicitations Data",
    );

    if (res.success) {
      return {
        success: true,
        status: res.status,
        data: res.data,
      };
    } else {
      return {
        success: false,
        status: res.status,
      };
    }
  } catch (e) {
    return {
      success: false,
      status: 500,
    };
  }
}


export async function AcceptSolicitation(
  id: number,
  cookieString: string,
  csrfTokenString: string,
): Promise<SolicitationPostResult> {
  let URL = `${process.env.backendBaseURL}/solicitacoes/aceitar/${id}/`;

  try {
    const res = await authRequestWrapper(
      URL,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: cookieString,
          "X-CSRFToken": csrfTokenString,
        },
      },
      "Accept Solicitation",
    );

    if (res.success) {
      return {
        success: res.success,
        status: res.status,
      };
    } else {
      return {
        success: false,
        status: res.status,
      };
    }
  } catch (e) {
    console.error("Accept Solicitation Request Error:", e);
    return {
      success: false,
      status: 500,
    };
  }
}

export async function RejectSolicitation(
  id: number,
  cookieString: string,
  csrfTokenString: string,
): Promise<SolicitationPostResult> {
  let URL = `${process.env.backendBaseURL}/solicitacoes/recusar/${id}/`;

  try {
    const res = await authRequestWrapper(
      URL,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: cookieString,
          "X-CSRFToken": csrfTokenString,
        },
      },
      "Reject Solicitation",
    );

    if (res.success) {
      return {
        success: res.success,
        status: res.status,
      };
    } else {
      return {
        success: false,
        status: res.status,
      };
    }
  } catch (e) {
    console.error("Reject Solicitation Request Error:", e);
    return {
      success: false,
      status: 500,
    };
  }
}