"use server";

import { CreateChat, PostMessage } from "../chat";
import {
  CreateChatResult,
  PostMessageData,
  PostMessageResult,
} from "../types/chat";

import { cookies } from "next/headers";

export async function PostMessageAction(messageData: PostMessageData): Promise<PostMessageResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const csrfToken = cookieStore.get("csrftoken")?.value;

    const cookieString = `access_token=${accessToken}; csrftoken=${csrfToken}`;

    const result: PostMessageResult = await PostMessage(messageData, cookieString, csrfToken);

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

export async function CreateChatAction(
  tutorId: number,
  conteudo: string,
): Promise<CreateChatResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const csrfToken = cookieStore.get("csrftoken")?.value;

    const cookieString = `access_token=${accessToken}; csrftoken=${csrfToken}`;

    const result: CreateChatResult = await CreateChat(tutorId, conteudo, cookieString, csrfToken);

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
