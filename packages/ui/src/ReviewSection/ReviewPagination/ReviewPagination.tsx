import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export function ReviewPagination() {
  return (
    <div className="
        flex 
        flex-col 
        items-end 
        gap-2 
    ">
      <span className="
        md:text-xs
        2xl:text-sm 
        text-slate-500
    ">
        Página 1 de 12
    </span>
      <div className="
        flex 
        items-center 
        gap-4
    ">
        <button className="
            hover:text-brand-primary 
            transition-colors
        ">
            <ChevronLeftIcon/>
        </button>
        <span className="
            text-sm 
            border-2 
            border-slate-800 
            px-3 
            py-0.5 
            rounded 
            text-slate-800
        ">
            1-10
        </span>
        <button className="
            hover:text-brand-primary 
            transition-colors
        ">
            <ChevronRightIcon/>
        </button>
      </div>
    </div>
  );
}