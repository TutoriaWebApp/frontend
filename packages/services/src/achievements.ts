import {GetAllAchievementsResult, GetUserAchievementsResult, AchivementUnlockedResult, GetSpecificAchievementsResult} from "./types/achievements"
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

export async function GetSpecificAchievement(achievementId: number): Promise<GetSpecificAchievementsResult> {
  const URL = `${process.env.backendBaseURL}/conquistas/${achievementId}/`;

  try {
    const res = await authRequestWrapper(
      URL,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
      "Request Specific Achievements",
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

export async function UnlockAchievement(
  userId: number,
  achievementId: number,
  // cookieString: string,
  // csrfTokenString: string | undefined,
): Promise<AchivementUnlockedResult> {
  const URL = `${process.env.backendBaseURL}/consegue/`;

  try {
    const res = await authRequestWrapper(
      URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Cookie: cookieString,
          // "X-CSRFToken": csrfTokenString,
        },
        body: JSON.stringify({usuarioId: userId, conquistaId: achievementId}),
      },
      "Post Unlock Achiwvement",
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
    console.error("Post Unlock Achievement Request Error:", e);

    return {
      success: false,
      status: 500,
    };
  }
}
