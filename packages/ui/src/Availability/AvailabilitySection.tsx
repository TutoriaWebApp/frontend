"use client";

import { useMemo, useState } from "react";
import { DaySelector } from "./DaySelector/DaySelector";
import { TimePicker } from "./TimePicker/TimePicker";
import { ScheduleModal } from "../Modals/ScheduleModal/ScheduleModal";

import { TimeSlot } from "@repo/services/availabilityTypes";
import { Specialty, TutorArea } from "@repo/services/userTypes";

interface AvailabilitySectionProps {
  availabilities: TimeSlot[];
  ownProfile: boolean;
  areas?: TutorArea[];
  specialties?: Specialty[];
}

export function AvailabilitySection({
  availabilities,
  ownProfile,
  areas,
  specialties
}: AvailabilitySectionProps) {
  const DAYS_MAP = [
    { key: "DOM", name: "Domingo" },
    { key: "SEG", name: "Segunda" },
    { key: "TER", name: "Terça" },
    { key: "QUA", name: "Quarta" },
    { key: "QUI", name: "Quinta" },
    { key: "SEX", name: "Sexta" },
    { key: "SAB", name: "Sábado" },
  ];

  const [selectedDayKey, setSelectedDayKey] = useState<string>("SEG");

  const daysStatus = useMemo(() => {
    return DAYS_MAP.map((day) => {
      const slotsForDay = availabilities.filter((slot) => slot.dia === day.key);
      const hasSlots = slotsForDay.length > 0;

      return {
        key: day.key,
        name: day.name,
        isAvailable: hasSlots,
        hasSlots: hasSlots,
      };
    });
  }, [availabilities]);

  useMemo(() => {
    const currentDayValid = daysStatus.find(
      (d) => d.key === selectedDayKey,
    )?.hasSlots;
    if (!currentDayValid) {
      const firstAvailableDay = daysStatus.find((d) => d.hasSlots);
      if (firstAvailableDay) {
        setSelectedDayKey(firstAvailableDay.key);
      }
    }
  }, [daysStatus, selectedDayKey]);

  const currentDaySlots = useMemo(() => {
    return availabilities.filter((slot) => slot.dia === selectedDayKey);
  }, [availabilities, selectedDayKey]);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <>
      <section>
        <div
          className="
        border-2 
        border-slate-50
        rounded-2xl 
        p-6 
        bg-slate-50/30
      "
        >
          {/* Componente de Dias */}
          <DaySelector
            days={daysStatus}
            selectedDay={selectedDayKey}
            onSelect={(dayKey) => {
              const dayTarget = daysStatus.find((d) => d.key === dayKey);

              if (dayTarget?.isAvailable) {
                setSelectedDayKey(dayKey as TimeSlot["dia"]);
              }
              
            }}
          />

          {/* Componente de Horários e Botão de Ação */}
          <div
            className="
            flex 
            flex-col 
            md:flex-row 
            justify-between 
            items-start 
            md:items-end 
            gap-8 
            mt-10
        "
          >
            <div className="flex flex-col">
              <div
                className="
              flex-1 
              w-full
            "
              >
                {" "}
                <p
                  className="
                text-xs
                2xl:text-sm 
                font-bold 
                text-slate-800 
                mb-4 
                underline 
                decoration-slate-400 
                underline-offset-8 
                uppercase 
                tracking-widest
              "
                >
                  Horários Disponíveis (
                  {DAYS_MAP.find((d) => d.key === selectedDayKey)?.name}):
                </p>
              </div>
              <div
                className="
                flex 
                flex-wrap 
                gap-2
              "
              >
                {currentDaySlots.length === 0 ? (
                  <p
                    className="
                    text-sm
                    2xl:text-base
                    text-slate-400 
                    py-4 
                    font-medium
                  "
                  >
                    Nenhum horário cadastrado para este dia da semana.
                  </p>
                ) : (
                  currentDaySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`
                        mt-2
                        ${ownProfile ? "bg-slate-200" : "bg-emerald-600"}
                        text-[15px] 
                        py-1.5 
                        px-3 
                        flex 
                        items-center 
                        gap-2 
                        rounded-xl 
                        border
                        ${ownProfile ? "border-slate-300/40" : "border-emerald-800"}
                        shadow-sm
                    `}
                    >
                      <span
                        className={`
                          ${ownProfile ? "text-slate-800" : "text-white"}
                          text-[15px] 
                          font-black
                        `}
                      >
                        {slot.horarioInicio.slice(0, 5)} -{" "}
                        {slot.horarioFim.slice(0, 5)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            {!ownProfile && (
              <button
                type="button"
                className="
              w-full 
              md:w-auto 
              bg-brand-primary 
              hover:bg-indigo-800  
              text-white 
              font-bold 
              py-3 
              px-8 
              rounded-xl 
              transition-all 
              shadow-lg 
              shadow-brand-primary/20 
            "
                onClick={openModal}
              >
                Solicitar Sessão
              </button>
            )}
          </div>
        </div>
      </section>
      <ScheduleModal isOpen={modalIsOpen} onClose={closeModal} availabilities={availabilities} areas={areas!} specialties={specialties!}/>
    </>
  );
}
