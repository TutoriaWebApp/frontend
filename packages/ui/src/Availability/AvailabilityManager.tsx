"use client";

import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { DaySelector } from "./DaySelector/DaySelector";
import { TimePicker } from "./TimePicker/TimePicker";

interface TimeSlot {
  id: string;
  time: string;
}

export function AvailabilityManager() {
  const [availability, setAvailability] = useState([
    { name: "Domingo", isAvailable: false, slots: [] },
    {
      name: "Segunda",
      isAvailable: true,
      slots: [
        { id: "1", time: "09:00" },
        { id: "2", time: "10:00" },
      ],
    },
    { name: "Terça", isAvailable: true, slots: [{ id: "3", time: "14:00" }] },
    { name: "Quarta", isAvailable: false, slots: [] },
    { name: "Quinta", isAvailable: false, slots: [] },
    { name: "Sexta", isAvailable: true, slots: [{id: "4", time: "09:00"}] },
    { name: "Sábado", isAvailable: false, slots: [] },
  ]);

  const [selectedDayName, setSelectedDayName] = useState("Segunda");
  const [newTime, setNewTime] = useState("");

  const currentDay = availability.find((d) => d.name === selectedDayName);

  // Função para remover um horário
  const removeSlot = (slotId: string) => {
    setAvailability((prev) =>
      prev.map((day) => {
        if (day.name === selectedDayName) {
          return { ...day, slots: day.slots.filter((s) => s.id !== slotId) };
        }
        return day;
      }),
    );
  };

  // Função para adicionar um horário
  const addSlot = () => {
    if (!newTime) return;

    setAvailability((prev) =>
      prev.map((day) => {
        if (day.name === selectedDayName) {
          const newSlot = { id: Math.random().toString(), time: newTime };
          // Opcional: ordenar os horários após adicionar
          const updatedSlots = [...day.slots, newSlot].sort((a, b) =>
            a.time.localeCompare(b.time),
          );
          return { ...day, isAvailable: true, slots: updatedSlots };
        }
        return day;
      }),
    );
    setNewTime("");
  };

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
            days={availability}
            selectedDay={selectedDayName}
            onSelect={setSelectedDayName}
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
            <div className="flex-1">
              <p
                className="
              text-xs 
              font-bold 
              text-slate-800 
              mb-4 
              underline 
              decoration-cyan-400 
              underline-offset-8 
              uppercase 
              tracking-widest
            "
              >
                Horários Disponíveis:
              </p>
              <TimePicker slots={currentDay?.slots || []} />
            </div>

            <button
              type="button"
              className="
              w-full 
              md:w-auto 
              bg-brand-primary 
              hover:bg-indigo-800  
              text-white 
              font-bold 
              py-2
              px-8 
              rounded-xl 
              transition-all 
              shadow-lg 
              shadow-brand-primary/20 
            "
            >
              Adicionar  Sessão
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
