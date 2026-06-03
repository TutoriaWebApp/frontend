"use client";

import { useState, useContext, useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { NotificationContext } from "../../contexts/NotificationContext/NotificationContext";

import { TimeSlot } from "@repo/services/availabilityTypes";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  availabilities: TimeSlot[];
}

const indexToWeekday: Record<number, TimeSlot["dia"]> = {
  0: "DOM",
  1: "SEG",
  2: "TER",
  3: "QUA",
  4: "QUI",
  5: "SEX",
  6: "SAB",
};

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function ScheduleModal({
  isOpen,
  onClose,
  availabilities,
}: ScheduleModalProps) {
  const { showNotification } = useContext(NotificationContext);

  const today = useMemo(() => new Date(), []);
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const [monthOffset, setMonthOffset] = useState<number>(0);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const targetMonthData = useMemo(() => {
    // Calcula o mês alvo virando o ano se necessário
    const targetMonth = (currentMonth + monthOffset) % 12;
    const targetYear =
      currentYear + Math.floor((currentMonth + monthOffset) / 12);

    // Primeiro dia do mês alvo (para descobrir em qual dia da semana ele começa)
    const firstDayInstance = new Date(targetYear, targetMonth, 1);
    const startDayOfWeek = firstDayInstance.getDay(); // 0 = Domingo, 1 = Segunda...

    // Total de dias contidos no mês alvo
    const totalDaysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

    return {
      monthIndex: targetMonth,
      year: targetYear,
      startDayOfWeek,
      totalDaysInMonth,
      label: `${monthNames[targetMonth]} ${targetYear}`,
    };
  }, [currentMonth, currentYear, monthOffset]);

  const calendarDays = useMemo(() => {
    const daysArray = [];
    const { year, monthIndex, startDayOfWeek, totalDaysInMonth } =
      targetMonthData;

    for (let i = 0; i < startDayOfWeek; i++) {
      daysArray.push({
        dayNumber: null,
        status: "disabled",
        dateInstance: null,
        weekdayKey: null,
      });
    }

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dateInstance = new Date(year, monthIndex, day);

      const dateCompare = new Date(
        dateInstance.getFullYear(),
        dateInstance.getMonth(),
        dateInstance.getDate(),
      );

      const todayCompare = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );

      const weekdayKey = indexToWeekday[dateInstance.getDay()];

      let status: "free" | "busy" = "busy";

      if (dateCompare >= todayCompare) {
        const hasTutorSlot = availabilities.some(
          (slot) => slot.dia === weekdayKey,
        );
        if (hasTutorSlot) {
          status = "free";
        }
      }

      daysArray.push({
        dayNumber: day,
        status,
        dateInstance,
        weekdayKey,
      });
    }

    return daysArray;
  }, [targetMonthData, availabilities, today]);

  const availableTimesForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];

    const weekdayKey = indexToWeekday[selectedDate.getDay()];

    return availabilities
      .filter((slot) => slot.dia === weekdayKey)
      .map((slot) => ({
        time: slot.horarioInicio.slice(0, 5),
        status: "free",
      }))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate, availabilities]);

  const handleDayClick = (dayItem: (typeof calendarDays)[0]) => {
    if (dayItem.status === "free" && dayItem.dateInstance) {
      setSelectedDate(dayItem.dateInstance);
      setSelectedTime(null);
    }
  };

  const handlePrevMonth = () => {
    if (monthOffset > 0) {
      setMonthOffset((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (monthOffset < 2) {
      setMonthOffset((prev) => prev + 1);
    }
  };

  const handleCancel = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setMonthOffset(0);
    onClose();
  };

  const makeSolicitation = () => {
    showNotification("Solicitação criada com sucesso!", "success");
    onClose();
  };

  //Fechando a modal
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed 
        inset-0 
        z-50 
        flex 
        items-center 
        justify-center 
        bg-black/50 
        backdrop-blur-sm 
        p-4
    "
    >
      <div
        className="
            bg-white 
            w-full 
            max-w-2xl 
            rounded-3xl 
            shadow-2xl 
            overflow-hidden 
        "
      >
        {/* Header */}
        <div
          className="
            flex
            justify-between
            items-center 
            p-6 
            border-b 
            border-slate-100
        "
        >
          <h2
            className="
            text-xl 
            font-bold 
            "
          >
            Solicitar Sessão de Tutoria
          </h2>
          <button
            onClick={handleCancel}
            className="
                text-slate-400 
                hover:text-slate-600 
                transition-colors
            "
          >
            <CloseIcon />
          </button>
        </div>

        <div
          className="
            p-6 
            space-y-8
        "
        >
          {/* Calendário */}
          <div
            className="
                border-2 
                border-slate-100 
                rounded-2xl 
                p-4
            "
          >
            <div
              className="
              flex 
              justify-between 
              items-center 
              mb-6
            "
            >
              <button
                disabled={monthOffset === 0}
                onClick={handlePrevMonth}
                className={`
                  p-1 
                  rounded-lg 
                  transition-colors 
                  ${monthOffset === 0 ? "text-slate-200 cursor-not-allowed" : "text-slate-500 hover:bg-slate-100 cursor-pointer"}`}
              >
                <ChevronLeftIcon />
              </button>
              <span
                className="
                font-extrabold 
                text-slate-700 
                select-none
              "
              >
                {targetMonthData.label}
              </span>
              <button
                disabled={monthOffset === 2}
                onClick={handleNextMonth}
                className={`
                  p-1 
                  rounded-lg 
                  transition-colors 
                  ${monthOffset === 2 ? "text-slate-200 cursor-not-allowed" : "text-slate-500 hover:bg-slate-100 cursor-pointer"}`}
              >
                <ChevronRightIcon />
              </button>
            </div>

            {/* Dias da Semana */}
            <div
              className="
              grid 
              grid-cols-7 
              gap-1 
              mb-2
            "
            >
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                <div
                  key={d}
                  className="
                    text-center 
                    text-xs
                    2xl:text-sm 
                    font-black 
                    text-slate-400 
                    uppercase 
                    tracking-widest"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Grade de Dias */}
            <div
              className="
              grid 
              grid-cols-7 
              gap-2
            "
            >
              {calendarDays.map((item, idx) => {
                const isSelected =
                  selectedDate &&
                  item.dateInstance &&
                  selectedDate.getDate() === item.dateInstance.getDate() &&
                  selectedDate.getMonth() === item.dateInstance.getMonth() &&
                  selectedDate.getFullYear() ===
                    item.dateInstance.getFullYear();

                if (item.dayNumber === null) {
                  return <div key={`empty-${idx}`} className="h-10" />;
                }

                return (
                  <button
                    key={`day-${idx}`}
                    disabled={item.status === "busy"}
                    onClick={() => handleDayClick(item)}
                    className={`
                      h-10 
                      rounded-xl 
                      border-2 
                      text-sm 
                      font-bold 
                      transition-all
                      ${
                        item.status === "busy" &&
                           "bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed opacity-60"
                      }
                      ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-700 text-white shadow-md shadow-indigo-100 scale-105"
                          : item.status !== "busy"
                          ? "bg-white border-slate-200 text-slate-700"
                          : ""
                      }
                    `}
                  >
                    {item.dayNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horários e Legenda */}
          <div
            className="
                flex 
                flex-col 
                md:flex-row 
                gap-8
            "
          >
            <div
              className="
              flex-1 
              space-y-4
            "
            >
              <p
                className="
                text-sm 
                font-bold 
                text-slate-800
              "
              >
                {selectedDate
                  ? `Horários livres para o dia ${selectedDate.toLocaleDateString()}:`
                  : "Selecione um dia disponível no calendário acima para ver os horários:"}
              </p>

              <div
                className="
                flex 
                flex-wrap 
                gap-2.5
              "
              >
                {selectedDate && availableTimesForSelectedDay.length === 0 && (
                  <p
                    className="
                    text-xs
                    2xl:text-sm 
                    font-semibold 
                    text-rose-500
                  "
                  >
                    Nenhum horário livre encontrado.
                  </p>
                )}

                {!selectedDate && (
                  <p
                    className="
                    text-xs 
                    font-medium 
                    text-slate-400
                  "
                  >
                    Aguardando escolha da data...
                  </p>
                )}

                {selectedDate &&
                  availableTimesForSelectedDay.map((t, idx) => (
                    <button
                      key={`time-${idx}`}
                      onClick={() => setSelectedTime(t.time)}
                      className={`
                        px-4 
                        py-2 
                        rounded-xl 
                        border-2 
                        font-black 
                        text-xs 
                        transition-all
                        cursor-pointer
											${
                        selectedTime === t.time
                          ? "bg-indigo-600 border-indigo-700 text-white shadow-md shadow-indigo-100"
                          : "bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:bg-indigo-50/20"
                      }
										`}
                    >
                      {t.time}
                    </button>
                  ))}
              </div>
            </div>

            {/* Seção de Legenda */}
            <div
              className="
              bg-slate-50/60 
              rounded-2xl 
              p-4 
              border 
              border-slate-200 
              space-y-3 
              w-full 
              md:w-56 
              h-fit
            "
            >
              <p
                className="
                text-[10px] 
                font-black 
                text-slate-400 
                uppercase 
                tracking-widest 
                mb-1
              "
              >
                Disponibilidade do Dia
              </p>
              <div
                className="
                flex 
                items-center 
                gap-2.5 
                text-xs 
                font-bold 
                text-slate-600
              "
              >
                <div
                  className="
                  w-3 
                  h-3 
                  rounded-md 
                  bg-white 
                  border-2 
                  border-slate-200
                "
                />
                <span>Horários disponíveis</span>
              </div>
              <div
                className="
                flex 
                items-center 
                gap-2.5 
                text-xs 
                font-bold 
                text-slate-600
              "
              >
                <div
                  className="
                  w-3 
                  h-3 
                  rounded-md 
                  bg-slate-100 
                  border 
                  border-slate-100 
                  opacity-60"
                />
                <span>Indisponível / Passado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="
            p-6 
            bg-slate-50 
            flex 
            justify-end 
            gap-4 
            border-t 
            border-slate-100
        "
        >
          <button
            onClick={handleCancel}
            className="
                px-6 
                py-2.5 
                rounded-xl 
                font-bold
                bg-slate-300
                text-slate-500 
                hover:bg-slate-400
                hover:text-slate-700 
                transition-all
            "
          >
            Cancelar
          </button>
          <button
            disabled={!selectedDate || !selectedTime}
            onClick={makeSolicitation}
            className={`
							px-8 
							py-2.5 
							rounded-xl 
							font-bold 
							text-sm
							transition-all
							${
                !selectedDate || !selectedTime
                  ? "bg-slate-300 text-slate-400 cursor-not-allowed"
                  : "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:bg-indigo-800 cursor-pointer"
              }
						`}
          >
            Solicitar
          </button>
        </div>
      </div>
    </div>
  );
}
