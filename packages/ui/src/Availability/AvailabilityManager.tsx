"use client";

import { useState, useMemo } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { DaySelector } from "./DaySelector/DaySelector";

import { AddScheduleModal } from "../Modals/ScheduleModal/AddScheduleModal";
import { DeleteScheduleModal } from "../Modals/ScheduleModal/DeleteScheduleModal";
import { TimeSlot } from "@repo/services/availabilityTypes";

interface AvailabilityManagerProps {
  availabilities: TimeSlot[];
  setAvailabilities: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
}

export function AvailabilityManager({
  availabilities,
  setAvailabilities,
}: AvailabilityManagerProps) {
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
  const [openDeleteScheduleModal, setDeleteScheduleModal] =
    useState<boolean>(false);
  const [availabilityToDelete, setAvailabilityToDelete] = useState<TimeSlot>();
  const [openModal, setOpenModal] = useState<boolean>(false);

const daysStatus = useMemo(() => {
    return DAYS_MAP.map((day) => {
      const slotsForDay = availabilities.filter(
        (slot) => slot.dia === day.key
      );

      return {
        key: day.key,
        name: day.name,
        isAvailable: true, 
        hasSlots: slotsForDay.length > 0, 
      };
    });
  }, [availabilities]);

  const currentDaySlots = useMemo(() => {
    return availabilities.filter((slot) => {
      const diaStr = typeof slot.dia === "string" ? slot.dia : slot.dia;
      return diaStr === selectedDayKey;
    });
  }, [availabilities, selectedDayKey]);

  const handleOpenDeleteModal = (availability: TimeSlot) => {
    setAvailabilityToDelete(availability);
    setDeleteScheduleModal(true);
  };

  return (
    <>
      <section>
        <div className="
          border-2 
          border-slate-50 
          rounded-2xl 
          p-6 
          bg-slate-50/30
        ">
          <DaySelector
            days={daysStatus}
            selectedDay={selectedDayKey}
            onSelect={setSelectedDayKey}
          />

          <div className="
            flex 
            flex-col 
            md:flex-row 
            justify-between 
            items-start 
            md:items-end 
            gap-8 
            mt-10
          ">
            <div className="
              flex-1 
              w-full
            ">
              <p className="
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
              ">
                Horários Disponíveis (
                {DAYS_MAP.find((d) => d.key === selectedDayKey)?.name}):
              </p>

              <div className="
                flex 
                flex-wrap 
                gap-2
              ">
                {currentDaySlots.length === 0 ? (
                  <p className="
                    text-sm
                    2xl:text-base
                    text-slate-400 
                    py-4 
                    font-medium
                  ">
                    Nenhum horário cadastrado para este dia da semana.
                  </p>
                ) : (
                  currentDaySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="
                        bg-slate-200 
                        text-[15px] 
                        py-1.5 
                        px-3 
                        flex 
                        items-center 
                        gap-2 
                        rounded-xl 
                        border 
                        border-slate-300/40 
                        shadow-sm
                    ">
                      <span className="
                        text-slate-800 
                        text-[15px] 
                        font-black
                      ">
                        {slot.horarioInicio.slice(0, 5)} -{" "}
                        {slot.horarioFim.slice(0, 6)}
                      </span>
                      <DeleteIcon
                        onClick={() => handleOpenDeleteModal(slot)}
                        className="
                          text-rose-500 
                          cursor-pointer 
                          hover:text-rose-700 
                          transition-all
                        "
                        sx={{ fontSize: 18 }}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="
          flex 
          justify-end
        ">
          <button
            type="button"
            onClick={() => setOpenModal(true)}
            className="
              w-auto 
              bg-emerald-600 
              hover:bg-emerald-800 
              text-white 
              font-bold 
              py-2.5 
              px-4 
              rounded-xl 
              transition-all 
              shadow-lg 
              flex 
              items-center 
              gap-2 
              mt-12 
              mb-6
          ">
            <AddIcon />
            <span>Adicionar Disponibilidade</span>
          </button>
        </div>
      </section>

      <AddScheduleModal
        isOpen={openModal}
        availabilities={availabilities}
        setAvailabilities={setAvailabilities}
        onClose={() => setOpenModal(false)}
      />
      <DeleteScheduleModal
        isOpen={openDeleteScheduleModal}
        availabilities={availabilities}
        availabilityToDelete={availabilityToDelete!}
        setAvailabilities={setAvailabilities}
        onClose={() => setDeleteScheduleModal(false)}
      />
    </>
  );
}
