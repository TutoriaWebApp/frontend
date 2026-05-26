import { Grade } from "@mui/icons-material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface TutorCardProps {
  name: string;
  photoURL: string;
  location: string;
  rating: number;
  totalRatings: number;
  subjects: string[];
  bio: string;
}

export const TutorCard = ({
  name,
  photoURL,
  location,
  rating,
  totalRatings,
  subjects,
  bio,
}: TutorCardProps) => (
  <div
    className="
    bg-white 
    rounded-[2.5rem] 
    border 
    border-slate-100 
    p-6 
    shadow-sm 
    hover:shadow-xl 
    hover:shadow-indigo-100 
    transition-all 
    flex 
    flex-col 
    items-center 
    text-center 
    group
    mx-auto
    max-w-[500px]
  "
  >
    {/* Foto */}
    <div
      className="
        w-32 
        h-32 
        bg-slate-200 
        rounded-full
        border-4 
        border-slate-200 
        shadow-md 
        flex-shrink-0 
        flex 
        items-center 
        justify-center
        mt-4
        mb-4
        group-hover:scale-105 
        transition-transform
    ">
      <img
        src={photoURL}
        alt="Foto do Perfil"
        className="
          w-full
          rounded-full
          object-cover
      "/>
    </div>

    <span className="
      text-xl 
      font-black 
      text-slate-800
      mb-2
    ">
      {name}
    </span>

    <div className="
      flex 
      items-center
      gap-1 
      text-slate-500 
      text-sm 
      mb-2
    ">
      <LocationOnIcon sx={{ fontSize: 16, color: "#FF3D00" }} />
      <span>{location}</span>
    </div>

    <div className="
      flex 
      items-center 
      gap-1 
      mb-3
    ">
      <Grade className="text-amber-400" sx={{ fontSize: 20 }} />
      <span className="
        font-bold 
        text-slate-700
        ">
          {Number.isInteger(rating) ? rating.toFixed(1) : rating.toFixed(2)}
        </span>
      <span className="
        text-slate-500 
        text-xs
        2xl:text-sm
      ">
        ({totalRatings} avaliações)
      </span>
    </div>

    <div className="
      flex 
      flex-wrap 
      gap-2
      justify-center
      mb-4
      h-[60px]
      overflow-y-auto
    ">
      {subjects.map((subject, index) => (
          <p key={index} className="
            text-xs
            2xl:text-sm 
            font-bold
            h-[23px] 
            text-indigo-600 
            bg-indigo-50 
            px-3 
            py-1 
            rounded-full 
          ">
            {subject}
          </p>

        ))}
    </div>

    <div className="
      h-[75px]
      w-full
    ">
      <p className="
        text-slate-500 
        text-sm
        2xl:text-base 
        leading-relaxed
        line-clamp-3
        overflow-hidden
      ">
        {bio}
      </p>

    </div>

    <button className="
      w-full
      lg:max-w-[250px] 
      py-3
      mt-2
      mb-2 
      bg-indigo-600 
      text-white 
      font-bold 
      rounded-2xl 
      hover:bg-indigo-700 
      shadow-lg 
      shadow-indigo-100 
      transition-all 
      active:scale-[0.98]
    ">
      Ver Perfil
    </button>
  </div>
);
