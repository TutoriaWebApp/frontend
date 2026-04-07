import { Grade } from "@mui/icons-material";

interface ReviewCardProps {
  photo?: string;
  name: string;
  rating: number;
  comment: string;
}

export function ReviewCard({ photo="https://imgs.search.brave.com/nVXWr4ySdiWgw7TFe6UN9wCIMUtBsS0Uf4uf1t7f1FE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9taXIt/czMtY2RuLWNmLmJl/aGFuY2UubmV0L3By/b2plY3RzLzQwNC8w/Nzc2YTYxMTY3NzM1/OTcuWTNKdmNDd3pP/RE0xTERNd01EQXNN/akkzTERBLmpwZw", name, rating, comment }: ReviewCardProps) {
  return (
    <div className="
        bg-white border-2 
        border-slate-100 
        rounded-xl 
        p-6 
        flex 
        gap-6 
        items-start 
        shadow-sm 
        hover:shadow-md 
        transition-shadow
    ">
      {/* Avatar */}
      <div className="
        w-20 
        h-20 
        bg-slate-200 
        rounded-2xl
        border-2 
        border-slate-800 
        flex 
        items-center 
        justify-center 
        flex-shrink-0 
        overflow-hidden
    ">
        <img src={photo} alt="Foto do Perfil" className="
            w-full
            rounded-2xl
        "/>
      </div>

      <div>
        <span className="
            font-bold 
            text-brand-primary 
            text-lg 
            mb-1
        ">
            {name}
        </span>
        
        <div className="flex mb-3">
          {[...Array(5)].map((_, i) => (
            <Grade 
              key={i} 
              className={i < rating ? "text-amber-400" : "text-slate-200"} 
              sx={{ fontSize: 24 }}
            />
          ))}
        </div>

        <div className="
            bg-slate-50 
            border 
            border-slate-200 
            rounded-lg 
            p-4 
          text-slate-600 
            md:text-sm 
            leading-relaxed
            2xl:text-base
        ">
          {comment}
        </div>
      </div>
    </div>
  );
}