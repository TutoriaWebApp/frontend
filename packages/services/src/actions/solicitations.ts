"use server";

import {
  SolicitationPostData,
  SolicitationPostResult,
} from "../types/solicitations";
import { CreateSolicitation } from "../solicitations";

import { cookies } from "next/headers";

export async function CreateSolicitationAction(
  bodyData: SolicitationPostData,
): Promise<SolicitationPostResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const csrfToken = cookieStore.get("csrftoken")!.value;

    const cookieString = `access_token=${accessToken}; csrftoken=${csrfToken}`;

    const result: SolicitationPostResult = await CreateSolicitation(bodyData, cookieString, csrfToken);

    if (result.success) {
      return { success: true, status: result.status };
    }

    return {
      success: false,
      status: result.status,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
    };
  }
}
