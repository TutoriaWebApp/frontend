import {GetAllAchievementsResult, GetUserAchievementsResult} from "./types/achievements"
import { authRequestWrapper } from "@repo/lib/authRequestWrapper"
import { getBackendUrl } from "@repo/lib/getBackendUrl"

export async function GetAllAchievements(): Promise<GetAllAchievementsResult> {
  const URL = `${getBackendUrl()}/conquistas/`;

  try {
    const res = await authRequestWrapper(
      URL,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
      "Request All Achievements",
    );

    if (res.success) {
      return {
        success: true,
        status: res.status,
        data: res.data,
      };
    }
    return { success: false, status: res.status };
  } catch (e) {
    return { success: false, status: 500 };
  }
}

export async function GetUserAchievements(userId: number): Promise<GetUserAchievementsResult> {
  const URL = `${getBackendUrl()}/conquistas/usuario/${userId}/`;

  try {
    const res = await authRequestWrapper(
      URL,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
      "Request User Achievements",
    );

    if (res.success) {
      return {
        success: true,
        status: res.status,
        data: res.data.results,
      };
    }
    return { success: false, status: res.status };
  } catch (e) {
    return { success: false, status: 500 };
  }
}