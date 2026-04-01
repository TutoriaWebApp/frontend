"use client";

import React, { createContext, useContext, useState } from "react";
import { SessionExpiredModal } from "../../SessionExpiredModal/SessionExpiredModal";

interface SessionExpiredAuthContextType {
  isSessionExpired: boolean;
  triggerSessionExpired: () => void;
  closeSessionExpired: () => void;
}

const SessionExpiredContext = createContext<SessionExpiredAuthContextType | undefined>(undefined);

export function SessionExpiredContextProvider({ children }: { children: React.ReactNode }) {
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const triggerSessionExpired = () => setIsSessionExpired(true);
  const closeSessionExpired = () => setIsSessionExpired(false);

  return (
    <SessionExpiredContext.Provider value={{ isSessionExpired, triggerSessionExpired, closeSessionExpired }}>
      {children}
      <SessionExpiredModal isOpen={isSessionExpired} />
    </SessionExpiredContext.Provider>
  );
}

export const useSessionExpired = () => {
  const context = useContext(SessionExpiredContext);
  if (!context) 
    throw new Error("useAuth deve ser usado dentro de um SessionExpiredContextProvider");
  return context;
};