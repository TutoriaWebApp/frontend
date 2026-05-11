"use client";

import React, { useContext } from "react";
import { StudentArea } from "@repo/services/userTypes";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { NotificationContext } from "../../contexts/NotificationContext/NotificationContext";

interface AddStudentAreaProps {
  isOpen: boolean;
  onClose: () => void;
  areas: StudentArea[];
  setAreas: React.Dispatch<React.SetStateAction<StudentArea[]>>;
  selectAreas: StudentArea[];
}

export function AddStudentAreaModal({
  isOpen,
  onClose,
  areas,
  setAreas,
  selectAreas,
}: AddStudentAreaProps) {
  if (!isOpen) return null;

  const { showNotification } = useContext(NotificationContext);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const selectedArea = formData.get("area") as string;

    if (!selectedArea) return;

    const alreadyExists = areas.some((a) => a.area === selectedArea);

    if (!alreadyExists) {
      setAreas((prev) => [...prev, { area: selectedArea } as StudentArea]);

      onClose();
    } else {
      showNotification("Essa área já foi adicionada!", "error");
    }
  };

  return (
    <div
      className="
        fixed 
        inset-0 
        z-[100] 
        flex 
        items-center 
        justify-center 
        bg-black/50 
        backdrop-blur-sm 
        p-4 
        animate-in 
        fade-in 
        duration-200
    "
    >
      <div
        className="
        bg-white 
        w-full 
        max-w-xl 
        rounded-3xl 
        shadow-2xl 
        overflow-hidden 
        animate-in 
        zoom-in-95 
        duration-200
    "
      >
        <div
          className="
            flex 
            justify-between 
            items-center 
            p-6 
            pb-0
        "
        >
          <h2
            className="
            text-xl 
            font-bold 
            text-slate-800 
            text-center
        "
          >
            Adicionar Área de Interesse
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <CloseIcon />
          </button>
        </div>

        <p
          className="
            text-base 
            text-slate-400
            ml-6
            mt-4
        "
        >
          Escolha uma área que está interessado em receber tutorias.
        </p>

        <form onSubmit={handleSubmit}>
          <div
            className="
            p-8 
            space-y-6
           "
          >
            <div className="space-y-3">
              <div className="relative group">
                <select
                  id="area"
                  name="area"
                  required
                  defaultValue=""
                  className="
                    w-full 
                    appearance-none 
                    bg-white border-2 
                    border-slate-200 
                    rounded-xl 
                    px-5 
                    py-2 
                    text-slate-600 
                    font-medium 
                    outline-none 
                    focus:border-brand-primary 
                    focus:ring-4 
                    focus:ring-brand-primary/5 
                    transition-all 
                    cursor-pointer 
                "
                >
                  <option value="" disabled>
                    Selecione uma opção de área de interesse
                  </option>
                  {selectAreas.map((area) => (
                    <option key={area.id} value={area.nomeArea} disabled>
                      Selecione uma opção de área de interesse
                    </option>
                  ))}
                </select>

                <div
                  className="
                    absolute 
                    right-4 
                    top-1/2 
                    -translate-y-1/2 
                    pointer-events-none 
                    text-slate-400 
                    group-focus-within:text-brand-primary 
                    transition-colors
                "
                >
                  <KeyboardArrowDownIcon />
                </div>
              </div>
            </div>
          </div>

          <div
            className="
            p-6 
            bg-slate-50 
            flex 
            flex-col 
            sm:flex-row 
            justify-end 
            gap-8
            border-t 
            border-slate-100
        "
          >
            <button
              type="button"
              onClick={onClose}
              className="
                order-2 
                sm:order-1 
                px-8 
                py-3 
                rounded-xl 
                font-bold 
                text-slate-600 
                bg-slate-200 
                hover:bg-slate-300 
                transition-all 
                active:scale-95
            "
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="
                order-1 
                sm:order-2 
                px-10 
                py-3 
                rounded-xl 
                bg-brand-primary 
                text-white 
                font-bold 
                shadow-lg 
                shadow-brand-primary/20 
                hover:bg-indigo-700 
                transition-all 
                active:scale-95 
                flex 
                items-center 
                justify-center 
                gap-2
            "
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
