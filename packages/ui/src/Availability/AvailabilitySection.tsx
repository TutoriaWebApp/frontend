"use client";

import { useState } from "react";
import { DaySelector } from "./DaySelector/DaySelector";
import { TimePicker } from "./TimePicker/TimePicker";

export function AvailabilitySection() {
  // Exemplo de estrutura de dados do Django
  const [availabilityData] = useState([
    { name: "Domingo", isAvailable: false, slots: [] },
    { 
      name: "Segunda", 
      isAvailable: true, 
      slots: [
        { time: "09:00" },
        { time: "10:00" },
        { time: "14:00" }
      ] as const
    },
    { name: "Terça", isAvailable: true, slots: [{ time: "11:00" }] as const },
    { name: "Quarta", isAvailable: false, slots: [] },
    { name: "Quinta", isAvailable: false, slots: [] },
    { name: "Sexta", isAvailable: true, slots: [{ time: "09:00"}] as const },
    { name: "Sábado", isAvailable: false, slots: [] },
  ]);

  const [selectedDayName, setSelectedDayName] = useState("Segunda");

  // Encontra os horários do dia clicado
  const currentDayData = availabilityData.find(d => d.name === selectedDayName);

  return (
    <section>
      
      <div className="border-2 border-slate-50 rounded-2xl p-6 bg-slate-50/30">

        {/* Componente de Dias */}
        <DaySelector 
          days={availabilityData} 
          selectedDay={selectedDayName} 
          onSelect={setSelectedDayName} 
        />

        {/* Componente de Horários e Botão de Ação */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mt-10">
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-800 mb-4 underline decoration-cyan-400 underline-offset-8 uppercase tracking-widest">
              Horários Disponíveis:
            </p>
            <TimePicker slots={currentDayData?.slots || []} />
          </div>

          <button 
            type="button"
            className="w-full md:w-auto bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-brand-primary/20 hover:-translate-y-1 active:translate-y-0"
          >
            Solicitar Sessão
          </button>
        </div>
      </div>
    </section>
  );
}