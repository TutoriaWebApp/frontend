"use client";

import React from "react";
import { Specialty } from "@repo/services/userTypes";
import CloseIcon from "@mui/icons-material/Close";

interface DeleteSpecialtyModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialty: Specialty | null;
  specialties: Specialty[];
  setSpecialties: React.Dispatch<React.SetStateAction<Specialty[]>>;
}

export function DeleteSpecialtyModal({
  isOpen,
  onClose,
  specialty,
  specialties,
  setSpecialties,
}: DeleteSpecialtyModalProps) {
  if (!isOpen) return null;

  const deleteSpecialty = () => {
    const newSpecialties = specialties.filter((s) => {
     return s.id != specialty!.id;
    })

    setSpecialties(newSpecialties);
    onClose();
  }

  return (
    <div className="
      fixed 
      inset-0 
      z-[100] 
      flex 
      items-center 
      justify-center 
      bg-black/50 
      backdrop-blur-sm 
      p-4 
      animate-in 
      fade-in 
      duration-200
    ">
      <div className="
        bg-white 
        w-full 
        max-w-md 
        rounded-3xl 
        shadow-2xl 
        overflow-hidden 
        animate-in 
        zoom-in-95 
        duration-200
      ">
        <div className="
          flex 
          justify-between 
          items-start 
          p-6 
          pb-0
        ">
          <h2 className="
            text-xl 
            font-bold 
            text-slate-800
          ">
            Remover Especialidade
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="
              text-slate-400 
              hover:text-slate-600 
              transition-colors 
              p-1
          ">
            <CloseIcon />
          </button>
        </div>

        <div className="
          p-6 
          pt-4 
          space-y-3
        ">
          <p className="
            text-slate-500 
            leading-relaxed 
            text-sm
          ">
            Tem certeza que deseja remover{" "}
            <span className="
              font-bold 
              text-slate-700
            ">
              "{specialty!.nomeEspecialidade}"
            </span>?
            <br />
          </p>
        </div>

        <div className="
          p-6 
          bg-slate-50 
          flex 
          flex-col 
          sm:flex-row 
          justify-end 
          gap-3 
          border-t 
          border-slate-100
        ">
          <button
            type="button"
            onClick={onClose}
            className="
              order-2 
              sm:order-1 
              px-6 
              py-2.5 
              rounded-xl 
              font-bold 
              text-slate-600 
              bg-slate-200 
              hover:bg-slate-300 
              transition-all 
              active:scale-95
          ">
            Cancelar
          </button>
          <button
            type="button"
            onClick={deleteSpecialty}
            className="
              order-1 
              sm:order-2 
              px-6 
              py-2.5 
              rounded-xl 
              bg-rose-500 
              text-white 
              font-bold 
              shadow-lg 
              shadow-rose-200 
              hover:bg-rose-800 
              transition-all 
              active:scale-95
          ">
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}
