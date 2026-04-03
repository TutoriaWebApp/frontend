import React from "react";

import { GetUserData } from "@repo/services/user";

import { UserData } from "@repo/services/userTypes";

import { redirect } from "next/navigation";

import { Grade } from "@mui/icons-material";

import ReviewSection from "@repo/ui/ReviewSection/ReviewSection";

export default async function ProfilePage() {
  let userData: UserData | boolean = false;

  const results = await GetUserData();

  if (!results.success) {
    if (results.status === 401) {
      redirect("/?session=expired");
    }
  } else {
    userData = results.data;
  }

  return (
    <>
    </>
  );
}
