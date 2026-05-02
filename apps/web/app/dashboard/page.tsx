"use client"

import React, { useEffect } from "react";

import { useEvaluation } from "@repo/ui/contexts/EvaluateUserContext/EvaluateUserContext";

export default function Dashboard(): React.ReactNode {
  const { triggerEvaluation } = useEvaluation();

  const getUnevaluatedSessions = async () => {
    const sessions = [
      {
        userId: 1,
        userName: "Lucas",
        isTutor: true,
        sessionSubject: "História",
        day: "19/05/2026",
        time: "13:00",
      },
      {
        userId: 2,
        userName: "João",
        isTutor: false,
        sessionSubject: "História",
        day: "19/05/2026",
        time: "14:00",
      },
      {
        userId: 3,
        userName: "Silas",
        isTutor: false,
        sessionSubject: "História",
        day: "19/05/2026",
        time: "15:00",
      },
      {
        userId: 4,
        userName: "Márcio",
        isTutor: true,
        sessionSubject: "História",
        day: "19/05/2026",
        time: "16:00",
      },
    ];

    return sessions;
  };

  useEffect(() => {
    async function fetchSessions() {
      const res = await getUnevaluatedSessions();
      //const data = await res.json();

      if (res) {
        for (let i = 0; i < res.length; i++) {
          await triggerEvaluation(
            res[i]!.userId,
            res[i]!.userName,
            res[i]!.isTutor,
            res[i]!.sessionSubject,
            res[i]!.day,
            res[i]!.time,
          );
        }
      }
    }

    fetchSessions();
  }, []);

  return (
    <>
      <div>
        <p>dashboard</p>
      </div>
    </>
  );
}
