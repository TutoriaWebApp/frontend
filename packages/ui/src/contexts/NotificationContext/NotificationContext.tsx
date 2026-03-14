"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

interface NotificationContextData {
  showNotification: (
    message: string,
    severity?: "success" | "error" | "info" | "warning",
  ) => void;
}

export const NotificationContext = createContext<NotificationContextData>(
  {} as NotificationContextData,
);

export const NotificationContextProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const showNotification = (msg: string, sev: typeof severity = "success") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: "12px", fontWeight: "600" }}
        >
          {message}
        </MuiAlert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
