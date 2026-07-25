import { authRequestWrapper } from '@repo/lib/authRequestWrapper';
import { GetReviewsResult } from './types/review';

export async function GetReviewsStudent(
  pageNumber: number = 1,
  gradeOrder: string,
  userId: number,
  areaId?: number,
  specialtyId?: number,
  page_size: number = 6
): Promise<GetReviewsResult> {
  let URL = `${process.env.backendBaseURL}/avaliacoes/aprendiz/?page=${pageNumber}`;

  // if (areaId) {
  //   URL += `&area=${areaId}`;
  // }

  // if (specialtyId) {
  //   URL += `&especialidade=${specialtyId}`;
  // }

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
  let URL = `${process.env.backendBaseURL}/avaliacoes/tutor/?page=${pageNumber}`;

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