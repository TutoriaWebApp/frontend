"use client";

import React from "react";
import { TutorArea, Specialty } from "@repo/services/userTypes";
import CloseIcon from "@mui/icons-material/Close";

interface DeleteTutorAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  area: TutorArea | null;
  areas: TutorArea[];
  setAreas: React.Dispatch<React.SetStateAction<TutorArea[]>>;
  specialties: Specialty[];
  setSpecialties: React.Dispatch<React.SetStateAction<Specialty[]>>;
}

export function DeleteTutorAreaModal({
  isOpen,
  onClose,
  area,
  areas,
  setAreas,
  specialties,
  setSpecialties,
}: DeleteTutorAreaModalProps) {
  if (!isOpen) return null;

  const deleteArea = () => {
    //Apaga a área da lista de áreas
    const newAreas = areas.filter((a) => {
      return a.id != area?.id;
    });

    setAreas(newAreas);

    const filteredSpecialites = specialties.filter(
      (specialty) => specialty.areaId != area?.id,
    );

    setSpecialties(filteredSpecialites);

    onClose();
  };

  return (
    <div
      className="
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
    "
    >
      <div
        className="
        bg-white 
        w-full 
        max-w-md 
        rounded-3xl 
        shadow-2xl 
        overflow-hidden 
        animate-in 
        zoom-in-95 
        duration-200
      "
      >
        <div
          className="
          flex 
          justify-between 
          items-start 
          p-6 
          pb-0
        "
        >
          <h2
            className="
            text-xl 
            font-bold 
            text-slate-800
          "
          >
            Remover Área de Tutoria
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="
              text-slate-400 
              hover:text-slate-600 
              transition-colors 
              p-1
          "
          >
            <CloseIcon />
          </button>
        </div>

        <div
          className="
          p-6 
          pt-4 
          space-y-3
        "
        >
          <p
            className="
            text-slate-500 
            leading-relaxed 
            text-sm
          "
          >
            Tem certeza que deseja remover{" "}
            <span
              className="
              font-bold 
              text-slate-700
            "
            >
              "{area?.nomeArea}"
            </span>
            ?
            <br />
          </p>

          <p
            className="
            text-slate-500 
            leading-relaxed 
            text-sm
          "
          >
            Remover essa área irá remover todas as especialidades associadas à
            ela.
            <br />
          </p>
        </div>

        <div
          className="
          p-6 
          bg-slate-50 
          flex 
          flex-col 
          sm:flex-row 
          justify-end 
          gap-3 
          border-t 
          border-slate-100
        "
        >
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
          "
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={deleteArea}
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
          "
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}
