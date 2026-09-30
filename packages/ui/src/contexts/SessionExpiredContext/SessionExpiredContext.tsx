"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { SessionExpiredModal } from "../../Modals/SessionExpiredModal/SessionExpiredModal";

interface SessionExpiredAuthContextType {
  isSessionExpired: boolean;
  triggerSessionExpired: () => void;
  closeSessionExpired: () => void;
}

const SessionExpiredContext = createContext<SessionExpiredAuthContextType | undefined>(undefined);

export function SessionExpiredContextProvider({ children }: { children: React.ReactNode }) {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const triggerSessionExpired = () => setIsSessionExpired(true);
  const closeSessionExpired = () => setIsSessionExpired(false);

  useEffect(() => {
    if (searchParams.get("session") === "expired") {
      setIsSessionExpired(true);

      // Remove o parâmetro ?session=expired da barra de endereço sem recarregar a tela
      const params = new URLSearchParams(searchParams.toString());
      params.delete("session");
      const remainingQuery = params.toString();
      const cleanUrl = remainingQuery ? `${pathname}?${remainingQuery}` : pathname;

      router.replace(cleanUrl, { scroll: false });
    }
  }, [searchParams, pathname, router]);

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
    throw new Error("useSessionExpired deve ser usado dentro de um SessionExpiredContextProvider");
  return context;
};