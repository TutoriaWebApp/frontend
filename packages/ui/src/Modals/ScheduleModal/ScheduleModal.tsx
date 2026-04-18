"use client";

import { useState, useContext } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { NotificationContext } from "../../contexts/NotificationContext/NotificationContext";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduleModal({ isOpen, onClose }: ScheduleModalProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { showNotification } = useContext(NotificationContext);

    
  //Fechando a modal
  if (!isOpen) {
    return null;
  }

  // Mock de dados para o calendário
  const days = Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    status: i === 1 || i === 3 ? "busy" : i === 8 ? "pending" : "free",
  }));

  const times = [
    { time: "09:00", status: "free" },
    { time: "10:00", status: "pending" },
    { time: "11:00", status: "busy" },
  ];

  const makeSolicitation = () => {
    showNotification("Solicitação criada com sucesso!", "success");
    onClose();
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
            onClick={onClose}
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
                className="
                    text-slate-400 
                    hover:text-slate-800
                "
              >
                <ChevronLeftIcon />
              </button>
              <span
                className="
                    font-bold 
                    text-slate-700
                "
              >
                Abril 2024
              </span>
              <button
                className="
                    text-slate-400 
                    hover:text-slate-800
                "
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
                    md:text-xs 
                    font-bold 
                    text-slate-400 
                    uppercase
                    2xl:text-sm
                "
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
              {days.map((item) => (
                <button
                  key={item.day}
                  onClick={() =>
                    item.status !== "busy" && setSelectedDay(item.day)
                  }
                  className={`
                        h-10 
                        rounded-lg 
                        border-2 
                        text-sm 
                        font-bold 
                        transition-all
                        
                        ${item.status === "busy" ? "bg-red-200 border-rose-400 text-red-600 cursor-not-allowed" : ""}
                        ${item.status === "pending" ? "bg-amber-200 border-amber-400 text-amber-600" : ""}
                        ${item.status === "free" ? "bg-slate-50 border-slate-100 text-slate-600 hover:border-emerald-400 hover:bg-emerald-200" : ""}
                        ${item.day === selectedDay ? "bg-emerald-400 border-emerald-700 text-white shadow-lg scale-105 hover:border-emerald-700 hover:bg-emerald-400" : ""}
                    `}
                >
                  {item.day}
                </button>
              ))}
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
            <div className="
                flex-1 
                space-y-4
            ">
              <p className="
                text-sm 
                font-bold 
                text-slate-800
            ">
                Horários Disponíveis:
              </p>
              <div className="
                flex 
                gap-3
              ">
                {times.map((t) => (
                  <button
                    key={t.time}
                    onClick={() => setSelectedTime(t.time)}
                    className={`
                        px-4 
                        py-2 
                        rounded-lg 
                        border-2 
                        font-bold 
                        text-xs 
                        transition-all
                      ${
                        selectedTime === t.time
                          ? "bg-emerald-400 border-emerald-700 text-white"
                          : "bg-white border-slate-400 text-slate-600 hover:border-emerald-400 hover:bg-emerald-200"
                      }
                    `}
                  >
                    {t.time}
                  </button>
                ))}
              </div>
            </div>

            {/* Seção de Legenda */}
            <div className="
                bg-slate-50 
                rounded-xl 
                p-4 
                border 
                border-slate-300 
                space-y-2 
                w-full 
                md:w-56
            ">
              <p className="
                text-[11px] 
                font-black 
                text-slate-400 
                uppercase 
                tracking-widest 
                mb-2
              ">
                Significado das Cores
              </p>
              <div className="
                flex 
                items-center 
                gap-3 
                text-xs 
                font-bold 
                text-slate-600
              ">
                <div className="
                    w-3 
                    h-3 
                    rounded-full 
                    bg-emerald-500
                ">
                </div>
                <span>Livre</span>
              </div>
              <div className="
                flex 
                items-center 
                gap-3 
                text-xs 
                font-bold 
                text-slate-600
              ">
                <div className="
                    w-3 
                    h-3 
                    rounded-full 
                    bg-amber-400
                ">
                </div>
                <span>Já tem solicitação</span>
              </div>
              <div className="
                flex 
                items-center 
                gap-3 
                text-xs 
                font-bold 
                text-slate-600">
                    <div className="
                        w-3
                        h-3 
                        rounded-full 
                        bg-rose-400
                    ">
                    </div>
                    <span>Indisponível</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="
            p-6 
            bg-slate-50 
            flex 
            justify-end 
            gap-4 
            border-t 
            border-slate-100
        ">
          <button
            onClick={onClose}
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
            disabled={!selectedDay || !selectedTime}
            onClick={makeSolicitation}
            className={`
                px-8 
                py-2.5 
                rounded-xl 
                bg-brand-primary 
                text-white 
                font-bold 
                shadow-lg 
                shadow-brand-primary/20 
                hover:bg-indigo-800
                disabled:bg-gray-500
                transition-all
            `}
          >
            Solicitar
          </button>
        </div>
      </div>
    </div>
  );
}
