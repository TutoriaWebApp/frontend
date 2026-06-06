import { authRequestWrapper } from "@repo/lib/authRequestWrapper";
import {
  SolicitationGetResult,
  SolicitationPostData,
  SolicitationPostResult,
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

export async function GetSolicitations(): Promise<SolicitationGetResult>{
  const baseURL = `${process.env.backendBaseURL}/solicitacoes/`;
  
  try{
    const res = await authRequestWrapper(
      baseURL,
      { method: "GET" },
      "Request Solicitations Data",
    );

    if(res.success){
      return {
        success: true,
        status: res.status,
        data: res.data
      }
    }
    else{
      return{
        success: false,
        status: res.status
      }
    }
  }
  catch(e){
    return{
      success: false,
      status: 500
    }
  }
}
