"use client";

import React, { useContext } from "react";
import { StudentArea } from "@repo/services/userTypes";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { NotificationContext } from "../../contexts/NotificationContext/NotificationContext";

interface AddStudentAreaProps {
  isOpen: boolean;
  onClose: () => void;
  areas: StudentArea[];
  setAreas: React.Dispatch<React.SetStateAction<StudentArea[]>>;
  selectAreas: StudentArea[];
}

export function AddStudentAreaModal({
  isOpen,
  onClose,
  areas,
  setAreas,
  selectAreas,
}: AddStudentAreaProps) {
  if (!isOpen) return null;

  const { showNotification } = useContext(NotificationContext);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  //   const formData = new FormData(e.currentTarget);
  //   const selectedArea = formData.get("area") as string;

  //   if (!selectedArea) return;

  //   const alreadyExists = areas.some((a) => a.area === selectedArea);

  //   if (!alreadyExists) {
  //     setAreas((prev) => [...prev, { area: selectedArea } as StudentArea]);

      onClose();
  //   } else {
  //     showNotification("Essa área já foi adicionada!", "error");
  //   }
  };
}
