import AddIcon from "@mui/icons-material/Add";

import {StudentArea} from "@repo/services/userTypes"

import {AddStudentAreaModal} from "../Modals/StudentAreas/AddStudentArea"
import { useState } from "react";

interface AddStudentAreaProps {
  areas: StudentArea[];
  setAreas: React.Dispatch<React.SetStateAction<StudentArea[]>>;
}

export const AddStudentArea = ({areas, setAreas}: AddStudentAreaProps) => {
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
    ">
      <AddIcon />
      <span>Adicionar Área de Interesse</span>
    </button>
    <AddStudentAreaModal areas={areas} setAreas={setAreas} isOpen={openModal} onClose={closeModal} />
      </>
  );
};
