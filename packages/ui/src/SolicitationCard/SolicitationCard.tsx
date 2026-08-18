import { formatarDataBR } from "@repo/lib/formatData";
import { useMemo } from "react";
import Link from "next/link";
import { Grade } from "@mui/icons-material";

interface SolicitationCardProps {
  area: string;
  speciality: string;
  photoURL: string | null;
  date: string;
  name: string;
  startTime: string;
  endTime: string;
  expirationTime?: string;
  recurrent?: boolean;
  status?: string;
  mode: string;
  onReject?: any;
  onAccept?: any;
  userId: number;
  grade: number;
  totalReviews: number;
  filter: string;
}

export const SolicitationCard = ({
  area,
  speciality,
  photoURL,
  date,
  name,
  startTime,
  endTime,
  expirationTime,
  recurrent,
  status,
  mode,
  onReject,
  onAccept,
  userId,
  grade,
  totalReviews,
  filter
}: SolicitationCardProps) => {
  const timeRemaining = useMemo(() => {
    if (!expirationTime) return null;

    const todayDate = new Date();
    const expirationDate = new Date(expirationTime);

    const totalSeconds = Math.floor(
      (expirationDate.getTime() - todayDate.getTime()) / 1000,
    );

    if (totalSeconds <= 0) {
      return { hours: 0, minutes: 0 };
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return { hours, minutes };
  }, [expirationTime]);

  return (
    <>
      <div
        className="
      bg-white
      rounded-[2.5rem] 
      border 
      border-slate-100 
      p-8 
      shadow-sm
      hover:shadow-md 
      transition-all 
      flex 
      flex-col 
      text-center
      mx-auto
      max-w-[500px]
      w-full
      "
      >
        <h3
          className="
          text-xl 
          font-black 
          text-slate-800 
          mb-6 
          "
        >
          Solicitação de {area} ({speciality})
        </h3>

        <div
          className="
        flex 
        items-start 
        gap-4 
        mb-8 
        w-full 
        justify-center
        "
        >
          <Link href={`/perfil/${userId}`}>
            <div
              className="
            w-32 
          h-32 
          md:w-26 
          md:h-26 
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
          "
            >
              <img
                src={photoURL || undefined}
                alt="Foto do Perfil"
                className="
                    w-full
                    rounded-full
                    object-cover
                    hover:brightness-50
                    hover:transition
                  "
              />
            </div>
          </Link>
        </div>
        <div
          className="
            flex 
            items-center 
            gap-1
          text-slate-600
            justify-center
            mb-4
        ">
          <Grade className="text-amber-400" sx={{ fontSize: 20 }} />
          <span
            className="
              md:text-sm 
              font-medium
              2xl:text-base
          ">
            {Number.isInteger(grade)
              ? grade!.toFixed(1)
              : grade!.toFixed(2)}{" "}
            como{" "}
            <em className="text-slate-800 not-italic font-bold">{filter === "aprendiz" ? "Tutor" : "Aprendiz"}</em> (
            {totalReviews} avaliações)
          </span>
        </div>
        <div
          className="
          text-left 
          space-y-1
          flex
          flex-col
          gap-1
        "
        >
          <Link href={`/perfil/${userId}`}>
            <p
              className="
            text-base
            text-slate-500 
            font-medium
            overflow-hidden
            text-ellipsis
            hover:underline
            "
            >
              Nome: <span className="text-slate-800 font-bold">{name}</span>
            </p>
          </Link>
          <p
            className="
            text-base 
            text-slate-500 
            font-medium
            "
          >
            Data:{" "}
            <span className="text-slate-800 font-bold">
              {formatarDataBR(date)}
            </span>
          </p>
          <p
            className="
            text-base 
            text-slate-500 
            font-medium
            "
          >
            Horário de Início:{" "}
            <span className="text-slate-800 font-bold">{`${startTime[0]}${startTime[1]}:${startTime[3]}${startTime[4]}`}</span>
          </p>
          <p
            className="
            text-base 
            text-slate-500 
            font-medium
            "
          >
            Horário de Fim:{" "}
            <span className="text-slate-800 font-bold">{`${endTime[0]}${endTime[1]}:${endTime[3]}${endTime[4]}`}</span>
          </p>
          {mode == "solicitacoes_tutor" && (
            <p
              className="
            text-base 
            text-slate-500 
            font-medium
          "
            >
              Recorrente:{" "}
              {recurrent == true ? (
                <span className="text-slate-800 font-bold">Sim</span>
              ) : (
                <span className="text-slate-800 font-bold">Não</span>
              )}
            </p>
          )}
          <p
            className="
            text-base 
            text-slate-500 
            font-medium
            "
          >
            Status: <span className="text-slate-800 font-bold">{status}</span>
          </p>
          {mode == "solicitacoes_tutor" && (
            <p
              className="
            text-base 
            text-red-500 
            text-center
            "
            >
              Restam{" "}
              {expirationTime && (
                <>
                  {timeRemaining && (
                    <>
                      {timeRemaining.hours > 0 && (
                        <span className="text-red-600 font-bold">
                          {`${timeRemaining.hours} horas e `}
                        </span>
                      )}
                      <span className="text-red-600 font-bold">
                        {`${timeRemaining.minutes} minutos`}{" "}
                      </span>
                      para responder
                    </>
                  )}
                </>
              )}
            </p>
          )}
        </div>

        {mode == "sessoes_tutor" && (
          <button
            className="
          mt-6
          mb-2
      w-full 
      py-1.5 
        bg-rose-600 
        hover:bg-rose-700 
        text-white 
        font-black 
        rounded-xl 
        shadow-lg 
        shadow-rose-100 
        transition-all 
        active:scale-[0.98]
        "
          >
            Cancelar
          </button>
        )}
        {/* {mode == "minhas" && (
      <button
      className="
      mt-6
        mb-2
        w-full 
        py-1.5 
        bg-rose-600 
        hover:bg-rose-700 
        text-white 
        font-black 
        rounded-xl 
        shadow-lg 
        shadow-rose-100 
        transition-all 
        active:scale-[0.98]
        "
        >
        Cancelar
        </button>
    )} */}
        {mode == "solicitacoes_tutor" && (
          <div className="flex gap-4">
            <button
              onClick={onAccept}
              className="
              mt-6
              mb-2
              py-1.5
              w-full 
              bg-emerald-600 
              hover:bg-emerald-700 
              text-white 
              font-black 
              rounded-xl 
              shadow-lg 
              shadow-rose-100 
              transition-all 
              active:scale-[0.98]
              "
            >
              Confirmar
            </button>
            <button
              onClick={onReject}
              className="
            mt-6
            mb-2
            py-1.5
            w-full 
            bg-rose-600 
            hover:bg-rose-700 
            text-white 
            font-black 
            rounded-xl 
            shadow-lg 
            shadow-rose-100 
            transition-all 
            active:scale-[0.98]
            "
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </>
  );
};
