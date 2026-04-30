"use client";

import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { DaySelector } from "./DaySelector/DaySelector";

import { AddScheduleModal } from "../Modals/ScheduleModal/AddScheduleModal";
import { DeleteScheduleModal } from "../Modals/ScheduleModal/DeleteScheduleModal";

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
    { name: "Sexta", isAvailable: true, slots: [{ id: "4", time: "09:00" }] },
    { name: "Sábado", isAvailable: false, slots: [] },
  ]);

  
  // Schedule Modal
  const [openDeleteScheduleModal, setDeleteScheduleModal] =
    useState<boolean>(false);
  const setDeleteScheduleModalOpen = () => setDeleteScheduleModal(true);
  const closeDeleteScheduleModal = () => setDeleteScheduleModal(false);

  const [selectedDayName, setSelectedDayName] = useState("Segunda");
  const [newTime, setNewTime] = useState("");

  const [openModal, setOpenModal] = useState<boolean>(false);

  const setModalOpen = () => setOpenModal(true);
  const closeModal = () => setOpenModal(false);


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
              decoration-slate-400 
              underline-offset-8 
              uppercase 
              tracking-widest
            "
              >
                Horários Disponíveis:
              </p>
              <div
                className="
                flex 
                flex-wrap 
                gap-2
              "
              >
                {currentDay?.slots.map((slot) => (
                  <div
                    key={slot.time}
                    className={`
                    bg-slate-200 
                    text-[15px] 
                    py-1.5 
                    px-3
                    flex
                    items-center
                    gap-2
                    rounded 
                  `}
                  >
                    <span
                      className="    
                      text-slate-800 
                      text-[15px] 
                      font-black 
                    "
                    >
                      {slot.time}
                    </span>
                    <DeleteIcon
                      onClick={setDeleteScheduleModalOpen}
                      className="
                      text-rose-500
                      cursor-pointer
                      hover:text-[28px]
                    hover:text-rose-900
                      transition-all
                    "
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={setModalOpen}
            className="
              w-full 
              md:w-auto 
              bg-emerald-600 
              hover:bg-emerald-800  
              text-white 
              font-bold 
              py-2
              px-8 
              rounded-xl 
              transition-all 
              shadow-lg 
              shadow-brand-primary/20
              flex
              items-center
              gap-2
              mt-12
              mb-6
            "
          >
            <AddIcon />
            <span>Adicionar Disponibilidade</span>
          </button>
        </div>
      </section>
      <AddScheduleModal isOpen={openModal} onAdd={setAvailability} onClose={closeModal}/>
      <DeleteScheduleModal isOpen={openDeleteScheduleModal} onClose={closeDeleteScheduleModal} />
    </>
  );
}
