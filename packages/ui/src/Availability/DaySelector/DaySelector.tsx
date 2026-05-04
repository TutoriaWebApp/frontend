interface DayAvailability {
  name: string;
  isAvailable: boolean;
}

interface DaySelectorProps {
  days: DayAvailability[];
  selectedDay: string;
  onSelect: (name: string) => void;
}

export function DaySelector({ days, selectedDay, onSelect }: DaySelectorProps) {
  return (
    <div className="
      grid 
      grid-cols-2 
      sm:grid-cols-4 
      md:grid-cols-7 
      gap-2 
      mb-6
    ">
      {days.map((day) => (
        <button
          key={day.name}
          disabled={!day.isAvailable}
          onClick={() => onSelect(day.name)}
          className={`
            py-2 
            px-3 
            rounded-md 
            border-2 
            font-bold 
            transition-all 
            sm:text-xs 
            uppercase 
            tracking-wider
            2xl:text-sm
            ${!day.isAvailable 
              ? "bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed" 
              : day.name === selectedDay
                ? "bg-white border-brand-primary text-slate-800 shadow-sm"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-400"
            }
          `}
        >
          {day.name}
        </button>
      ))}
    </div>
  );
}