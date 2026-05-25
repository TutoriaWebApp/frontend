"use client";

import React, { useState, useMemo, useContext, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { Specialty, TutorArea } from "@repo/services/userTypes";

import { NotificationContext } from "../../contexts/NotificationContext/NotificationContext";

import { GetAreas, GetSpecialties } from "@repo/services/userClient";

import { ClipLoader } from "react-spinners";

interface AddSpecialtyModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorAreas: TutorArea[];
  setTutorAreas: React.Dispatch<React.SetStateAction<TutorArea[]>>;
  specialties: Specialty[];
  setSpecialties: React.Dispatch<React.SetStateAction<Specialty[]>>;
}

export function AddSpecialtyModal({
  isOpen,
  onClose,
  tutorAreas,
  setTutorAreas,
  setSpecialties,
  specialties,
}: AddSpecialtyModalProps) {
  const [selectedArea, setSelectedArea] = useState<TutorArea | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(
    null,
  );
  const [availableAreas, setAvailableAreas] = useState<TutorArea[]>([]);
  const [availableSpecialties, setAvailableSpecialties] = useState<Specialty[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSpecialty, setLoadingSpecialty] = useState<boolean>(false);

  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    async function fetchAreas() {
      const res = await GetAreas();

      if (!res.success) {
        showNotification(
          "Não foi possível obter as áreas de tutoria!",
          "error",
        );
        return;
      } else {
        setAvailableAreas(res.data);
      }
    }

    setLoading(false);

    if (isOpen) {
      fetchAreas();
    }
  }, [isOpen]);

  useEffect(() => {
    async function fetchSpecialties() {
      const res = await GetSpecialties();

      if (!res.success) {
        showNotification("Não foi possível obter as especialidades!", "error");
        return;
      } else {
        const filteredSpecialties = res.data.filter(
          (specialty: Specialty) =>
            specialty.areaId === selectedArea?.id &&
            !specialties.some((s) => s.id === specialty.id),
        );

        setAvailableSpecialties(filteredSpecialties);
      }
    }

    fetchSpecialties();
  }, [selectedArea]);

  if (!isOpen) return null;

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const area = availableAreas.find((a) => a.id === Number(e.target.value));
    setSelectedArea(area || null);
    setSelectedSpecialty(null);
  };

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const specialty = availableSpecialties.find(
      (s) => s.id === Number(e.target.value),
    );
    setSelectedSpecialty(specialty || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedArea && selectedSpecialty) {
      const areaAlreadyAdded = tutorAreas.some(
        (area) => area.id === selectedArea.id,
      );

      if (!areaAlreadyAdded) {
        setTutorAreas((prevTutorAreas) => [...prevTutorAreas, selectedArea]);
      }

      setSpecialties((prevSpecialties) => [
        ...prevSpecialties,
        selectedSpecialty,
      ]);

      handleClose();
    }

    handleClose();
  };

  const handleClose = () => {
    setSelectedArea(null);
    setSelectedSpecialty(null);
    onClose();
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
        {loading && (
          <ClipLoader
            color="#64748b"
            className="relative left-[47%]"
            size={120}
          />
        )}
        {!loading && (
          <>
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
                Adicionar Área e Especialidade de Tutoria
              </h2>
              <button
                onClick={onClose}
                className="
            text-slate-400 
            hover:text-slate-600 
                transition-colors 
                p-1
                "
              >
                <CloseIcon onClick={handleClose} />
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
              Escolha uma área e especialidade de ensino na sua área de tutoria.
            </p>

            <form onSubmit={handleSubmit}>
              <div
                className="
            p-8 
            space-y-6
            "
              >
                {/* Select 1: Área de Tutoria */}
                <div className="space-y-2">
                  <label
                    className="
                text-xs 
                font-black 
                text-slate-500 
                uppercase 
                tracking-widest
                "
                  >
                    Selecione a Área de Tutoria
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={selectedArea?.id || ""}
                      onChange={handleAreaChange}
                      className="
                  w-full 
                  appearance-none 
                  bg-white border-2 
                  border-slate-200 
                  rounded-xl 
                    px-5 
                    py-3
                    text-slate-700 
                    font-medium 
                    outline-none 
                    transition-all 
                    cursor-pointer
                    "
                    >
                      <option value="" disabled>
                        Selecione a área de tutoria
                      </option>
                      {availableAreas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.nomeArea}
                        </option>
                      ))}
                    </select>
                    <KeyboardArrowDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                  </div>
                </div>

                {/* Select 2: Especialidade */}
                <div className="space-y-2">
                  <label
                    className="
                text-xs 
                font-black 
                text-slate-500 
                uppercase 
                tracking-widest
                "
                  >
                    Selecione a Especialidade
                  </label>

                  <div className="relative">
                    <select
                      required
                      disabled={!selectedArea}
                      value={selectedSpecialty?.id || ""}
                      onChange={handleSpecialtyChange}
                      className={`
                    w-full 
                    appearance-none 
                    bg-white 
                    border-2 
                    rounded-xl 
                    px-5 
                    py-3 
                    font-medium 
                    outline-none 
                    transition-all
                    ${
                      !selectedArea
                        ? "border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50"
                        : "border-slate-200 text-slate-700 cursor-pointer"
                    }
                    `}
                    >
                      <option value="" disabled>
                        Selecione a especialidade
                      </option>
                      {availableSpecialties.map((specialty) => (
                        <option key={specialty.id} value={specialty.id}>
                          {specialty.nomeEspecialidade}
                        </option>
                      ))}
                    </select>
                    <KeyboardArrowDownIcon
                      className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${!selectedArea ? "text-slate-200" : "text-slate-400"}`}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                className="
            p-6 
            bg-slate-50 
            flex 
            flex-col 
            sm:flex-row 
            justify-end 
            gap-4 
            border-t 
            border-slate-100
            "
              >
                <button
                  type="button"
                  onClick={handleClose}
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
                "
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!selectedSpecialty}
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
                disabled:bg-gray-500
                "
                >
                  Adicionar Especialidade
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
