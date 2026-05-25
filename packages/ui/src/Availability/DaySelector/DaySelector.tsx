"use client";

interface DayStatus {
  key: string;
  name: string;
  isAvailable: boolean;
  hasSlots: boolean; // Nova propriedade para indicar se há horários cadastrados
}

interface DaySelectorProps {
  days: DayStatus[];
  selectedDay: string;
  onSelect: (key: string) => void;
}

export function DaySelector({ days, selectedDay, onSelect }: DaySelectorProps) {
  return (
    <div
      className="
      grid 
      grid-cols-2       
      sm:grid-cols-4       
      lg:grid-cols-7       
      gap-2       
      mb-6
    "
    >
      {days.map((day) => {
        const isSelected = day.key === selectedDay;

        return (
          <button
            key={day.key}
            type="button"
            onClick={() => onSelect(day.key)}
            className={`
              relative
              py-3
              px-3
              rounded-xl
              border-2               
              font-bold               
              transition-all               
              sm:text-xs               
              uppercase               
              tracking-wider
              2xl:text-sm
              text-center
              flex
              flex-col
              items-center
              justify-center
              gap-1
              ${
                isSelected
                  ? "bg-white border-indigo-600 text-slate-800 shadow-md shadow-indigo-50"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-400"
              }
            `}
          >
            {/* Container flex para alinhar o texto e a bolinha horizontalmente */}
            <div className="flex items-center gap-1.5 justify-center">
              <span>{day.name}</span>
              {day.hasSlots && (
                <span
                  className="w-2 h-2 rounded-full bg-indigo-600 animate-fade-in"
                  title="Possui horários"
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
