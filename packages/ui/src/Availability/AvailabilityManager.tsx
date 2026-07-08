"use client";

import { useState, useMemo } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { DaySelector } from "./DaySelector/DaySelector";

import { AddScheduleModal } from "../Modals/ScheduleModal/AddScheduleModal";
import { DeleteScheduleModal } from "../Modals/ScheduleModal/DeleteScheduleModal";
import { TimeSlot } from "@repo/services/availabilityTypes";
import { SessionGetData } from "@repo/services/sessionTypes";
import { SolicitationGetData } from "@repo/services/solicitationTypes";

interface AvailabilityManagerProps {
  availabilities: TimeSlot[];
  setAvailabilities: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
  sessions?: SessionGetData[];
  solicitations?: SolicitationGetData[];
}

export function AvailabilityManager({
  availabilities,
  setAvailabilities,
  sessions = [],
  solicitations = []
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

  const getDayKeyFromDateString = (dateStr: string): string => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year!, month! - 1, day!);
    const dayIndex = date.getDay();
    return DAYS_MAP[dayIndex]?.key || "";
  };

  const formatTime = (timeStr: string) => timeStr.slice(0, 5);

  const checkSlotConflict = (slot: TimeSlot) => {
    const hasSessionConflict = sessions.some((session) => {
      if (!session.dataSessao) return false;
      const sessionDayKey = getDayKeyFromDateString(session.dataSessao);
      return (
        sessionDayKey === slot.dia &&
        formatTime(session.horarioInicio) === formatTime(slot.horarioInicio) &&
        formatTime(session.horarioFim) === formatTime(slot.horarioFim)
      );
    });

    const hasSolicitationConflict = solicitations.some((solicitation) => {
      if (!solicitation.dataPretendida) return false;
      const solDayKey = getDayKeyFromDateString(solicitation.dataPretendida);
      return (
        solDayKey === slot.dia &&
        formatTime(solicitation.horarioInicio) === formatTime(slot.horarioInicio) &&
        formatTime(solicitation.horarioFim) === formatTime(slot.horarioFim) &&
        solicitation.estado === "PENDENTE"
      );
    });

    return hasSessionConflict || hasSolicitationConflict;
  };

  const currentDayHasAnyConflict = useMemo(() => {
    return availabilities
      .filter((slot) => slot.dia === selectedDayKey)
      .some((slot) => checkSlotConflict(slot));
  }, [availabilities, selectedDayKey, sessions, solicitations]);

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
    if (checkSlotConflict(availability)) return;

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

              {currentDayHasAnyConflict && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs md:text-sm font-medium">
                  <ReportProblemIcon sx={{ fontSize: 18 }} />
                  <span>
                    Os horários destacados em vermelho possuem sessões como tutor confirmadas ou solicitações pendentes e não podem ser apagados.
                  </span>
                </div>
              )}

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
                  currentDaySlots.map((slot) => {
                    const isBlocked = checkSlotConflict(slot);

                    return (
                      <div
                        key={slot.id}
                        className={`
                          text-[15px] 
                          py-1.5 
                          px-3 
                          flex 
                          items-center 
                          gap-2 
                          rounded-xl 
                          border 
                          shadow-sm
                          transition-all
                          ${isBlocked 
                            ? "bg-rose-100 border-rose-300 text-rose-950" 
                            : "bg-slate-200 border-slate-300/40 text-slate-800"
                          }
                      `}>
                        <span className={`
                          text-[15px] 
                          font-black
                          ${isBlocked ? "text-rose-900" : "text-slate-800"}
                        `}>
                          {slot.horarioInicio.slice(0, 5)} -{" "}
                          {slot.horarioFim?.slice(0, 5) || slot.horarioFim.slice(0, 5)}
                        </span>
                        
                        {!isBlocked ? (
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
                        ) : (
                          <ReportProblemIcon 
                            className="text-rose-400" 
                            sx={{ fontSize: 16 }} 
                            titleAccess="Horário bloqueado devido a compromisso agendado"
                          />
                        )}
                      </div>
                    );
                  })
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