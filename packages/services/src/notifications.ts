import { authRequestWrapper } from "@repo/lib/authRequestWrapper";
import { getBackendUrl } from "@repo/lib/getBackendUrl";
import {NotificationResult} from "./types/notification";

export async function GetNotifications(): Promise<NotificationResult> {
  const URL = `${getBackendUrl()}/notificacoes-resumo/`;

  try {
    const res = await authRequestWrapper(
      URL,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      "Notification Request",
    );

    if (res.success) {
      return {
        success: res.success,
        status: res.status,
        data: res.data
      };
    } else {
      return {
        success: false,
        status: res.status,
      };
    }
  } catch (e) {
    console.error("Notification Request Error:", e);

    return {
      success: false,
      status: 500,
    };
  }
}
