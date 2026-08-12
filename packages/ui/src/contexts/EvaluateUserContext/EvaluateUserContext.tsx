// context/EvaluationContext.tsx
"use client";

import React, { createContext, useState, useContext, useRef } from "react";
import { EvaluateUserModal } from "../../Modals/EvaluateUser/EvaluateUser";

interface EvaluateUserContextData {
  triggerEvaluation: (
    sessionId: number,
    sessionDate: string,
    startTime: string,
    areaName: string,
    specialtyName: string,
    userName: string,
    photoURL: string,
    reviewType: string,
    userId: number
  ) => Promise<boolean>;
}

export const EvaluationContext = createContext<EvaluateUserContextData>(
  {} as EvaluateUserContextData,
);

export function EvaluateUserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    sessionId: 0,
    sessionDate: "",
    startTime: "",
    areaName: "",
    specialtyName: "",
    userName: "",
    photoURL: "",
    reviewType: "",
    userId: 0
  });

  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const triggerEvaluation = async (
    sessionId: number,
    sessionDate: string,
    startTime: string,
    areaName: string,
    specialtyName: string,
    userName: string,
    photoURL: string,
    reviewType: string,
    userId: number
  ) => {
    setUserInfo({sessionId, sessionDate, startTime, areaName, specialtyName,
                 userName, photoURL, reviewType, userId });
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const handleCloseModal = () => {
    setIsOpen(false);

    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null; 
    }
  };

  return (
    <EvaluationContext.Provider value={{ triggerEvaluation }}>
      {children}
      <EvaluateUserModal
        isOpen={isOpen}
        sessionId={userInfo.sessionId}
        sessionDate={userInfo.sessionDate}
        startTime={userInfo.startTime}
        areaName={userInfo.areaName}
        specialtyName={userInfo.specialtyName}
        userName={userInfo.userName}
        photoURL={userInfo.photoURL}
        reviewType={userInfo.reviewType}
        userId={userInfo.userId}
        setClose={handleCloseModal}
      />
    </EvaluationContext.Provider>
  );
}

export const useEvaluation = () => useContext(EvaluationContext);
