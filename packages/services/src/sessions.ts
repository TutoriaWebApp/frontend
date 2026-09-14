import { authRequestWrapper } from "@repo/lib/authRequestWrapper";
import { getBackendUrl } from "@repo/lib/getBackendUrl";
import {
  SessionsGetResult,
  SpecificTutorSessionGetResult,
  AllUserSessionGetResult
} from "./types/sessions";
import { GetUserDataClient } from "./userClient";

export async function GetSessions(
  areaId?: number,
  specialtyId?: number,
  order?: string,
  type?: string,
  pageNumber: number = 1,
  page_size: number = 6,
): Promise<SessionsGetResult> {
  let URL = `${getBackendUrl()}/sessoes/?page=${pageNumber}`;

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
      "Request Sessions Data",
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

export async function GetSpecificTutorSessions(
  tutorId: number,
): Promise<SpecificTutorSessionGetResult> {
  let URL = `${getBackendUrl()}/sessoes-tutor/`;

  URL += `?tutor_id=${tutorId}`;

  try {
    const res = await authRequestWrapper(
      URL,
      { method: "GET" },
      "Request Specific Tutor Sessions Data",
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

export async function GetAllUserSessions(): Promise<AllUserSessionGetResult | boolean> {
  try {
    const res = await GetUserDataClient();

    if (res.success && res.data.perfilTutor != null) {
      let URL = `${getBackendUrl()}/todas-sessoes-usuario/`;

      const sessionRes = await authRequestWrapper(
        URL,
        { method: "GET" },
        "Request All User Sessions Data",
      );

      if (sessionRes.success) {
        return {
          success: true,
          status: sessionRes.status,
          data: sessionRes.data,
        };
      } else {
        return {
          success: false,
          status: sessionRes.status,
        };
      }
    }
    else{
      return false;
    }
  } catch (e) {
    return {
      success: false,
      status: 500,
    };
  }
}
