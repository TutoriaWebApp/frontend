"use client";

import React from "react";
import { Specialty } from "@repo/services/userTypes";
import CloseIcon from "@mui/icons-material/Close";
import { TimeSlot } from "@repo/services/availabilityTypes";

interface DeleteScheduleModalProps {
  isOpen: boolean;
  availabilities: TimeSlot[];
  availabilityToDelete: TimeSlot;
  setAvailabilities: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
  onClose: () => void;
}

export function DeleteScheduleModal({
  isOpen,
  availabilities,
  availabilityToDelete,
  setAvailabilities,
  onClose,
}: DeleteScheduleModalProps) {
  if (!isOpen) return null;

  const DAYS_OF_WEEK = [
    { name: "Domingo", value: "DOM" },
    { name: "Segunda", value: "SEG" },
    { name: "Terça", value: "TER" },
    { name: "Quarta", value: "QUA" },
    { name: "Quinta", value: "QUI" },
    { name: "Sexta", value: "SEX" },
    { name: "Sábado", value: "SAB" },
  ];

  const beginTime = `${availabilityToDelete.horarioInicio.split(":")[0]}:${availabilityToDelete.horarioInicio.split(":")[1]}`;
  const endTime = `${availabilityToDelete.horarioFim.split(":")[0]}:${availabilityToDelete.horarioFim.split(":")[1]}`;
  const dayObj = DAYS_OF_WEEK.find(
    (d) => d.value === availabilityToDelete.dia,
  );
  const day = dayObj?.name;

  const deleteAvailability = () => {
    const filteredAvailabilities = availabilities.filter((availability) => {
      return availability.id != availabilityToDelete?.id;
    });

    setAvailabilities(filteredAvailabilities);
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
        max-w-xl
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
            Remover Disponibilidade
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
            Tem certeza que deseja remover a disponibilidade de{" "}
            <span className="font-bold">{beginTime} - </span>
            <span className="font-bold">{endTime} </span>
            de <span className="font-bold">{day}?</span>
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
            onClick={deleteAvailability}
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
