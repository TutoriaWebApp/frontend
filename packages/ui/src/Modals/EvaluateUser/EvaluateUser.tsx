"use client";

import React, { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface EvaluateUserModalProps {
  isOpen: boolean;
  userName: string;
  isTutor: boolean;
  sessionSubject: string;
  day: string;
  time: string;
  onClose: () => void;
  //   onSubmit: (data: { rating: number; comment: string }) => void;
}

export function EvaluateUserModal({
  isOpen,
  userName,
  isTutor,
  sessionSubject,
  day,
  time
}: EvaluateUserModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      //   onSubmit({ rating, comment });
      // O fechamento será controlado pelo componente pai ao finalizar a requisição
    }
  };

  return (
    <div className="
        fixed 
        inset-0 
        z-[150] 
        flex 
        items-center 
        justify-center 
        bg-slate-900/60 
        backdrop-blur-md 
        p-4 
        animate-in 
        fade-in 
        duration-300
    ">
      <div className="
        bg-white 
        w-full 
        max-w-lg 
        rounded-xl 
        shadow-2xl 
        flex 
        flex-col 
        max-h-[90vh] 
        animate-in 
        zoom-in-95 
        duration-300
    ">
        <div className="
            overflow-y-auto 
            custom-scrollbar 
            p-8 
            md:p-10
        ">
          <div className="
            flex 
            flex-col 
            items-center 
            text-center 
            mb-8
        ">
            <h2 className="
                text-2xl 
                font-black 
                text-slate-800
            ">
              {isTutor ? "Avaliar Tutor" : "Avaliar Aprendiz"}
            </h2>

                <div
                  className="
                    w-32 
                    h-32 
                    md:w-40 
                    md:h-40 
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
              ">
                  <img
                    src={``}
                    alt="Foto do Perfil"
                    className="
                    w-full
                    rounded-full
                    object-cover
                  "/>
            </div>

            <p className="
                text-slate-500 
                mt-2
            ">
              Sua avaliação é fundamental. Como foi sua experiência com{" "}
              <span className="
                font-bold 
                text-slate-700
              ">
                {userName}
              </span>?
            </p>
            <p className="
                text-slate-500 
                mt-4
            ">
              Vocês tiveram uma sessão de tutoria em <b>{sessionSubject}</b> no dia <b>{day}</b> às <b>{time}</b>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="
                flex 
                flex-col 
                items-center 
                gap-3
            ">
              <div className="
                flex 
                gap-2
            ">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(star)}
                    className="
                        transition-transform 
                        hover:scale-110 
                        active:scale-90
                    ">
                    {star <= (hover || rating) ? (
                      <StarIcon
                        className="text-amber-400"
                        sx={{ fontSize: 48 }}
                      />
                    ) : (
                      <StarBorderIcon
                        className="text-slate-200"
                        sx={{ fontSize: 48 }}
                      />
                    )}
                  </button>
                ))}
              </div>
              {rating === 0 && (
                <span className="
                    text-xs 
                    font-black 
                    uppercase 
                    tracking-widest 
                    text-rose-400 
                ">
                  Seleção obrigatória
                </span>
              )}
            </div>

            {/* Campo de Comentário */}
            <div className="space-y-3">
              <label className="
                text-xs 
                font-black 
                text-slate-400 
                uppercase 
                tracking-widest 
                ml-1
              ">
                Comentário (Opcional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte sobre os pontos positivos ou que pode melhorar..."
                rows={4}
                className="
                    w-full 
                    bg-slate-50 
                    border-2 
                    border-slate-100 
                    rounded-3xl 
                    p-5 
                    text-slate-600 
                    outline-none 
                    focus:border-amber-400 
                    focus:bg-white 
                    transition-all 
                    resize-none 
                    placeholder:text-slate-300"
              />
            </div>

            <div className="
                bg-slate-50 
                rounded-2xl 
                p-4 
                border 
                border-slate-100
            ">
              <p className="
                text-sm 
                text-slate-400 
                text-center 
                leading-relaxed
            ">
                Ao enviar, sua avaliação ficará visível no perfil desse {isTutor ? "tutor" :  "aprendiz"} e
                ajudará outros {isTutor ? "aprendizes a escolherem melhor" : "tutores a selecionarem aprendizes melhor"}.
              </p>
            </div>

            {/* Botão de Ação */}
            <button
              type="submit"
              disabled={rating === 0}
              className={`
                w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-xl
                ${
                  rating > 0
                    ? "bg-brand-primary text-white shadow-brand-primary/20 hover:bg-indigo-700 active:scale-[0.98]"
                    : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
                }
              `}
            >
              Finalizar e Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
