import { authRequestWrapper } from "@repo/lib/authRequestWrapper";
import { getBackendUrl } from "@repo/lib/getBackendUrl";
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
  csrfTokenString: string | undefined,
): Promise<SolicitationPostResult> {
  const URL = `${getBackendUrl()}/solicitacoes/`;

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
  let URL = `${getBackendUrl()}/solicitacoes/?page=${pageNumber}`;

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
  const URL = `${getBackendUrl()}/todas-solicitacoes/`;

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

export async function GetAllFutureTutorSolicitations(): Promise<AllSolicitationsGetResult> {
  const URL = `${getBackendUrl()}/todas-solicitacoes/?tipo=tutor&apenas_futuras=true`;

  try {
    const res = await authRequestWrapper(
      URL,
      { method: "GET" },
      "Request All Future Tutor Solicitations Data",
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

export async function GetResolvedLearnerSolicitations(): Promise<AllSolicitationsGetResult> {
  const URL = `${getBackendUrl()}/todas-solicitacoes/?tipo=aprendiz&apenas_resolvidas=true`;

  try {
    const res = await authRequestWrapper(
      URL,
      { method: "GET" },
      "Request Resolved Learner Solicitations Data",
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
  csrfTokenString: string | undefined,
): Promise<SolicitationPostResult> {
  let URL = `${getBackendUrl()}/solicitacoes/aceitar/${id}/`;

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
  csrfTokenString: string | undefined,
): Promise<SolicitationPostResult> {
  let URL = `${getBackendUrl()}/solicitacoes/recusar/${id}/`;

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