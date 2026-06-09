import { authRequestWrapper } from "@repo/lib/authRequestWrapper";
import { SessionsGetResult } from "./types/sessions";

export async function GetSessions(
  areaId?: number,
  specialtyId?: number,
  order?: string,
  type?: string,
  pageNumber: number = 1,
  page_size: number = 6
): Promise<SessionsGetResult> {
  let URL = `${process.env.backendBaseURL}/sessoes/?page=${pageNumber}`;

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
