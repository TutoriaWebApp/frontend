interface TimeSlot {
  time: string;
}

export function TimePicker({ slots }: { slots: readonly TimeSlot[] }) {

  return (
    <div className="flex flex-wrap gap-2">
        {slots.map((slot) => (
          <div
            key={slot.time}
            className={`
                bg-emerald-600 
                text-white 
                text-[15px] 
                font-black 
                py-1.5 
                px-3 
                rounded 
                shadow-sm 
                transition-transform 
              `}
          >
            {slot.time}
          </div>
        ))}
    </div>
  );
}