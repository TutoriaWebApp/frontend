import { Grade } from "@mui/icons-material";
import Link from "next/link";

interface ReviewCardProps {
  id: number;
  photo?: string;
  name: string;
  rating: number;
  comment: string;
}

export function ReviewCard({
  id,
  photo = "",
  name,
  rating,
  comment,
}: ReviewCardProps) {
  return (
    <div
      className="
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
    "
    >
      {/* Avatar */}
      <div
        className="
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
    "
      >
        <Link href={`/perfil/${id}`}>
          <img
            src={photo}
            alt="Foto do Perfil"
            className="
              w-full
              rounded-2xl
              cursor-pointer
              hover:brightness-50
              hover:transition
            "
          />
        </Link>
      </div>

      <div>
        <Link href={`/perfil/${id}`}>
        <span
          className="
            font-bold 
            text-brand-primary 
            text-lg 
            mb-1
            hover:cursor-pointer
            hover:underline
        "
        >
          {name}
        </span>
        </Link>

        <div className="flex mb-3">
          {[...Array(5)].map((_, i) => (
            <Grade
              key={i}
              className={i < rating ? "text-amber-400" : "text-slate-200"}
              sx={{ fontSize: 24 }}
            />
          ))}
        </div>

        {comment && (
          <div
            className="
        bg-slate-50 
        border 
        border-slate-200 
        rounded-lg 
        p-4 
        text-slate-600 
        md:text-sm 
        leading-relaxed
        2xl:text-base
        "
          >
            {comment}
          </div>
        )}
        {!comment && (
          <p className="text-slate-600">
            O usuário não escreveu comentário para essa avaliação.
          </p>
        )}
      </div>
    </div>
  );
}
