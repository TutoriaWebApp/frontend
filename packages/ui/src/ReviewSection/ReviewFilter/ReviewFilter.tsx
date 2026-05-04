import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export function ReviewFilter() {
  return (
    <div className="
        relative 
        inline-block
    ">
      <select className="
        appearance-none 
      bg-white border-2 
      border-slate-800 
        rounded-md 
        py-1 
        px-4 
        pr-10 
        text-slate-800 
        focus:outline-none 
        cursor-pointer
    ">
        <option>Área</option>
        <option>Matemática</option>
        <option>Programação</option>
      </select>
      <KeyboardArrowDownIcon className="
        absolute 
        right-2 
        top-1/2 
        -translate-y-1/2 
        pointer-events-none" />
    </div>
  );
}