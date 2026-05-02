// context/EvaluationContext.tsx
"use client";

import React, { createContext, useState, useContext, useRef } from "react";
import { EvaluateUserModal } from "../../Modals/EvaluateUser/EvaluateUser";

interface EvaluateUserContextData {
  triggerEvaluation: (
    userId: number,
    userName: string,
    isTutor: boolean,
    sessionSubject: string,
    day: string,
    time: string,
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
    userId: 0,
    userName: "",
    isTutor: false,
    sessionSubject: "",
    day: "",
    time: "",
  });

  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const triggerEvaluation = async (
    userId: number,
    userName: string,
    isTutor: boolean,
    sessionSubject: string,
    day: string,
    time: string,
  ) => {
    setUserInfo({ userId, userName, isTutor, sessionSubject, day, time });
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
        userId={userInfo.userId}
        userName={userInfo.userName}
        isTutor={userInfo.isTutor}
        sessionSubject={userInfo.sessionSubject}
        day={userInfo.day}
        time={userInfo.time}
        setClose={handleCloseModal}
      />
    </EvaluationContext.Provider>
  );
}

export const useEvaluation = () => useContext(EvaluationContext);
