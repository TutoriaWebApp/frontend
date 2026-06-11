"use server";

import {
  SolicitationPatchResult,
  SolicitationPostData,
  SolicitationPostResult,
} from "../types/solicitations";
import { AcceptSolicitation, CreateSolicitation, RejectSolicitation } from "../solicitations";

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

export async function AcceptSolicitationAction(
  id: number
): Promise<SolicitationPatchResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const csrfToken = cookieStore.get("csrftoken")!.value;

    const cookieString = `access_token=${accessToken}; csrftoken=${csrfToken}`;

    const result: SolicitationPatchResult = await AcceptSolicitation(id, cookieString, csrfToken);

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

export async function RejectSolicitationAction(
  id: number,
): Promise<SolicitationPatchResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const csrfToken = cookieStore.get("csrftoken")!.value;

    const cookieString = `access_token=${accessToken}; csrftoken=${csrfToken}`;

    const result: SolicitationPatchResult = await RejectSolicitation(id, cookieString, csrfToken);

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
