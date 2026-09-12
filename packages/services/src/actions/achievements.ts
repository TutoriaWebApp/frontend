import { UnlockAchievement } from "../achievements";
import {AchivementUnlockedResult} from "../types/achievements"

import { cookies } from "next/headers";

export async function UnlockAchievementAction(userId: number, achievementId: number): Promise<AchivementUnlockedResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const csrfToken = cookieStore.get("csrftoken")?.value;

    const cookieString = `access_token=${accessToken}; csrftoken=${csrfToken}`;

    const result: AchivementUnlockedResult = await UnlockAchievement(userId, achievementId, cookieString, csrfToken);

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