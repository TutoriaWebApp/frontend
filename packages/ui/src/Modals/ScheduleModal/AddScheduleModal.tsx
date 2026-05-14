"use client";

import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: any;
}

const DAYS_OF_WEEK = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];

export function AddScheduleModal({
  isOpen,
  onClose,
  onAdd,
}: AddScheduleModalProps) {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Gera a lista de horários de 00:00 até 23:00
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i < 10 ? `0${i}` : `${i}`;
    const nextHour =
      i + 1 < 10 ? `0${i + 1}` : i + 1 === 24 ? "00" : `${i + 1}`;
    return {
      value: `${hour}:00`,
      label: `${hour}:00 - ${nextHour}:00`,
    };
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedDay("");
    setSelectedTime("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDay && selectedTime) {
      onAdd(selectedDay, selectedTime);
      handleClose();
    }
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
        max-w-lg 
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
            items-center 
            p-6 
            pb-0
        "
        >
          <h2
            className="
            text-xl 
            font-bold 
            text-slate-800 
            text-center
        "
          >
            Adicionar Disponibilidade
          </h2>
          <button
            onClick={onClose}
            className="
                text-slate-400 
                hover:text-slate-600 
                transition-colors 
                p-1
          "
          >
            <CloseIcon onClick={handleClose} />
          </button>
        </div>

        <p
          className="
            text-base 
            text-slate-400
            ml-6
            mt-4
        "
        >
          Informe um dia e horário em que possui disponibilidade para lecionar
          uma sessão de tutoria.
        </p>

        <form onSubmit={handleSubmit}>
          <div
            className="
            p-8 
            space-y-6
          "
          >
            {/* Select 1: Dia da Semana */}
            <div className="space-y-2">
              <label
                className="
                text-xs 
                font-black 
                text-slate-500 
                uppercase 
                tracking-widest
               "
              >
                Escolha o dia
              </label>
              <div
                className="
                relative 
                group
              ">
                <select
                  required
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="
                    w-full 
                    appearance-none 
                    bg-white border-2 
                    border-slate-200 
                    rounded-xl 
                    px-5 
                    py-3 
                    text-slate-700 
                    font-medium 
                    outline-none 
                    focus:border-brand-primary 
                    focus:ring-4 
                    focus:ring-brand-primary/5 
                    transition-all 
                    cursor-pointer
                ">
                  <option value="" disabled>
                    Selecione o dia da semana
                  </option>
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <KeyboardArrowDownIcon className="
                    absolute 
                    right-4 
                    top-1/2 
                    -translate-y-1/2 
                    pointer-events-none 
                    text-slate-400 
                    group-focus-within:text-brand-primary 
                    transition-colors" 
                />
              </div>
            </div>

            {/* Select 2: Horário */}
            <div className="space-y-2">
              <label className="
                text-xs 
                font-black 
                text-slate-500 
                uppercase 
                tracking-widest
            ">
                Horário da Sessão
              </label>
              <div className="relative group">
                <select
                  required
                  disabled={!selectedDay}
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className={`
                    w-full 
                    appearance-none 
                    bg-white border-2 
                    rounded-xl 
                    px-5 
                    py-3 
                    font-medium 
                    outline-none 
                    transition-all
                    ${
                      !selectedDay
                        ? "border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50"
                        : "border-slate-200 text-slate-700 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 cursor-pointer"
                    }
                  `}
                >
                  <option value="" disabled>
                    Selecione o horário
                  </option>
                  {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <KeyboardArrowDownIcon
                  className={`
                        absolute 
                        right-4 
                        top-1/2 
                        -translate-y-1/2 
                        pointer-events-none 
                        ${!selectedDay ? "text-slate-100" : "text-slate-400 group-focus-within:text-brand-primary"}
                    `}
                />
              </div>
            </div>
          </div>

          <div className="
            p-6 
            bg-slate-50 
            flex 
            flex-col 
            sm:flex-row 
            justify-end 
            gap-4 
            border-t 
            border-slate-100
        ">
            <button
              type="button"
              onClick={handleClose}
              className="
                order-2 
                sm:order-1 
                px-8 
                py-3 
                rounded-xl 
                font-bold 
                text-slate-600 
                bg-slate-200 
                hover:bg-slate-300 
                transition-all
            ">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedDay || !selectedTime}
              className="
                order-1 
                sm:order-2 
                px-10 
                py-3 
                rounded-xl 
                bg-brand-primary 
                text-white 
                font-bold 
                shadow-lg 
                shadow-brand-primary/20 
                hover:bg-indigo-700  
                transition-all 
                disabled:bg-gray-500
            ">
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
