"use client";

import React from "react";
import { StudentArea } from "@repo/services/userTypes";
import CloseIcon from "@mui/icons-material/Close";

interface DeleteStudentAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  area: StudentArea | null;
  areas: StudentArea[];
  setAreas: React.Dispatch<React.SetStateAction<StudentArea[]>>;
}

export function DeleteStudentAreaModal({
  isOpen,
  onClose,
  setAreas,
  area,
  areas,
}: DeleteStudentAreaModalProps) {
  if (!isOpen) return null;

  // const deleteArea = () => {
  //   const newAreas = areas.filter((a) => {
  //     return a.id != area?.id;
  //   })

  //   setAreas(newAreas);
  //   onClose();
  // }
}
