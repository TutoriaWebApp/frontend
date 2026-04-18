import AddIcon from "@mui/icons-material/Add";

import {TutorArea} from "@repo/services/userTypes"

import {AddTutorAreaModal} from "../Modals/TutorAreas/AddTutorAreas"
import { useState } from "react";

interface AddTutorAreaProps {
  areas: TutorArea[];
  setAreas: React.Dispatch<React.SetStateAction<TutorArea[]>>;
}

export const AddTutorAreaButton = ({areas, setAreas}: AddTutorAreaProps) => {
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
        px-8 
        rounded-xl 
        transition-all 
        shadow-lg 
        shadow-brand-primary/20
        flex
        items-center
        gap-2
        mt-12
    ">
      <AddIcon />
      <span>Adicionar Área de Tutoria</span>
    </button>
    <AddTutorAreaModal areas={areas} setAreas={setAreas} isOpen={openModal} onClose={closeModal} />
      </>
  );
};
