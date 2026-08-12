"use server";

import {
  SendTutorReviewData,
  SendUserReviewData,
  SendReviewResult,
} from "../types/review";

import { PostUserReview, PostTutorReview } from "../review";

import { cookies } from "next/headers";

export async function PostUserReviewAction(
  bodyData: SendUserReviewData,
): Promise<SendReviewResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const csrfToken = cookieStore.get("csrftoken")!.value;

    const cookieString = `access_token=${accessToken}; csrftoken=${csrfToken}`;

    const result: SendReviewResult = await PostUserReview(bodyData, cookieString, csrfToken);

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

export async function PostTutorReviewAction(
  bodyData: SendTutorReviewData,
): Promise<SendReviewResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const csrfToken = cookieStore.get("csrftoken")!.value;

    const cookieString = `access_token=${accessToken}; csrftoken=${csrfToken}`;

    const result: SendReviewResult = await PostTutorReview(bodyData, cookieString, csrfToken);

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