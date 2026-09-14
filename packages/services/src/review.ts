import { authRequestWrapper } from '@repo/lib/authRequestWrapper';
import { getBackendUrl } from '@repo/lib/getBackendUrl';
import { GetReviewsResult, SendTutorReviewData, 
          SendUserReviewData, SendReviewResult, GetPendingReviewsResult } from './types/review';

export async function GetReviewsStudent(
  pageNumber: number = 1,
  gradeOrder: string,
  userId: number,
  page_size: number = 6
): Promise<GetReviewsResult> {
  let URL = `${getBackendUrl()}/avaliacoes/aprendiz/?page=${pageNumber}`;

  if(gradeOrder != ""){
    URL += `&ordering=${gradeOrder}`
  }

  URL += `&usuario=${userId}`
  
  URL += `&page_size=${page_size}`;

  const res = await authRequestWrapper(
    URL,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
    "Request Student Reviews",
  );

  if (res.success) {
    const successGetRelations: GetReviewsResult = {
      success: true,
      status: res.status,
      data: res.data,
    };
    return successGetRelations;
  } else {
    const failedRequest: GetReviewsResult = {
      success: false,
      status: res.status,
    };
    return failedRequest;
  }
}

export async function GetReviewsTutor(
  pageNumber: number = 1,
  gradeOrder: string,
  tutorId: number,
  areaId?: number,
  specialtyId?: number,
  page_size: number = 6
): Promise<GetReviewsResult> {
  let URL = `${getBackendUrl()}/avaliacoes/tutor/?page=${pageNumber}`;

  if (areaId != 0) {
    URL += `&area=${areaId}`;
  }

  if (specialtyId) {
    URL += `&especialidade=${specialtyId}`;
  }

  if(gradeOrder != ""){
    URL += `&ordering=${gradeOrder}`
  }

  URL += `&tutor=${tutorId}`
  
  URL += `&page_size=${page_size}`;

  const res = await authRequestWrapper(
    URL,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
    "Request Tutor Reviews",
  );

  if (res.success) {
    const successGetRelations: GetReviewsResult = {
      success: true,
      status: res.status,
      data: res.data,
    };
    return successGetRelations;
  } else {
    const failedRequest: GetReviewsResult = {
      success: false,
      status: res.status,
    };
    return failedRequest;
  }
}

export async function PostUserReview(
  bodyData: SendUserReviewData,
  cookieString: string,
  csrfTokenString: string | undefined,
): Promise<SendReviewResult> {
  const URL = `${getBackendUrl()}/avaliacoes/aprendiz/`;

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
      "Post User Review",
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
    console.error("Post User Review Request Error:", e);

    return {
      success: false,
      status: 500,
    };
  }
}

export async function PostTutorReview(
  bodyData: SendTutorReviewData,
  cookieString: string,
  csrfTokenString: string | undefined,
): Promise<SendReviewResult> {
  const URL = `${getBackendUrl()}/avaliacoes/tutor/`;

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
      "Post Tutor Review",
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
    console.error("Post Tutor Review Request Error:", e);

    return {
      success: false,
      status: 500,
    };
  }
}

export async function GetPendingReviews(): Promise<GetPendingReviewsResult> {
  const URL = `${getBackendUrl()}/avaliacoes/pendentes`;

  const res = await authRequestWrapper(
    URL,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
    "Request Pending Reviews",
  );

  if (res.success) {
    const successGetRelations: GetPendingReviewsResult = {
      success: true,
      status: res.status,
      data: res.data,
    };
    return successGetRelations;
  } else {
    const failedRequest: GetPendingReviewsResult = {
      success: false,
      status: res.status,
    };
    return failedRequest;
  }
}
