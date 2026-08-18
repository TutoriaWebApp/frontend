import { authRequestWrapper } from "@repo/lib/authRequestWrapper";
import {
  CreateChatResult,
  PostMessageData,
  PostMessageResult,
  GetChatResult,
  MessagesGetResult,
} from "./types/chat";

export async function PostMessage(
  messageData: PostMessageData,
  cookieString: string,
  csrfTokenString: string | undefined,
): Promise<PostMessageResult> {
  const baseURL = process.env.backendBaseURL;
  const URL = `${baseURL}/mensagens/`;

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
        body: JSON.stringify(messageData),
      },
      "Post Tutor Review",
    );

    return {
      success: res.success,
      status: res.status,
      data: res.data,
    };
  } catch (error) {
    console.error("Post Message Error:", error);
    return {
      success: false,
      status: 500,
    };
  }
}

export async function CreateChat(
  tutorId: number,
  conteudo: string,
  cookieString: string,
  csrfTokenString: string | undefined,
): Promise<CreateChatResult> {
  const baseURL = process.env.backendBaseURL;
  const URL = `${baseURL}/chats/`;

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
        body: JSON.stringify({ tutorId, conteudo }),
      },
      "Post Tutor Review",
    );

    const chatId = res.data.id;

    const postMessage = await PostMessage(
      { conteudo, chatId },
      cookieString,
      csrfTokenString,
    );

    if (postMessage.success) {
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
  } catch (error) {
    console.error("Post Message Error:", error);
    return {
      success: false,
      status: 500,
    };
  }
}

export async function GetChats(): Promise<GetChatResult> {
  const URL = `${process.env.backendBaseURL}/chats/`;

  try {
    const res = await authRequestWrapper(
      URL,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      "Request Chats",
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

export async function GetChatMessages(
  chatId: number,
  page: number = 1,
): Promise<MessagesGetResult> {
  const URL = `${process.env.backendBaseURL}/mensagens/?chatId=${chatId}&page=${page}`;

  try {
    const res = await authRequestWrapper(
      URL,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
      "Request Chat Messages",
    );

    if (res.success) {
      return {
        success: true,
        status: res.status,
        data: res.data.results,
        hasNext: !!res.data.next,
      };
    }
    return { success: false, status: res.status };
  } catch (e) {
    return { success: false, status: 500 };
  }
}
