import AddIcon from "@mui/icons-material/Add";

import { Specialty, TutorArea } from "@repo/services/userTypes";

import { AddSpecialtyModal } from "../Modals/Specialty/AddSpecialtyModal";
import { useState } from "react";

interface AddSpecialtyProps {
  areas: TutorArea[];
  setAreas: React.Dispatch<React.SetStateAction<TutorArea[]>>;
  specialties: Specialty[];
  setSpecialties: React.Dispatch<React.SetStateAction<Specialty[]>>;
}

export const AddSpecialty = ({
  areas,
  setAreas,
  specialties,
  setSpecialties,
}: AddSpecialtyProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const setModalOpen = () => setOpenModal(true);
  const closeModal = () => setOpenModal(false);

  return (
    <>
      <button
        type="button"
        onClick={setModalOpen}
        className="
      w-full 
      md:w-auto 
      bg-emerald-600 
      hover:bg-emerald-800  
      text-white 
      font-bold 
      py-2
      px-4 
      rounded-xl 
      transition-all 
      shadow-lg 
      shadow-brand-primary/20
      flex
      items-center
      gap-2
      mt-12
      "
      >
        <AddIcon />
        <span>Adicionar Área e Especialidade</span>
      </button>
      <AddSpecialtyModal
        isOpen={openModal}
        onClose={closeModal}
        tutorAreas={areas}
        setTutorAreas={setAreas}
        specialties={specialties}
        setSpecialties={setSpecialties}
      />
    </>
  );
};
