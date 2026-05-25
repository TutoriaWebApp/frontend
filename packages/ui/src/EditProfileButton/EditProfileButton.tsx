"use client";

import { redirect } from "next/navigation";

export const EditProfileButton = () => {
    const redirectToEdit = () => {
        redirect("/editar-perfil")
    }

  return (
    <>
      <button
      onClick={redirectToEdit}
        className="
        w-full
        bg-brand-primary 
        hover:bg-indigo-800 
        text-white 
        font-bold 
        py-2.5 
        px-6 
        rounded-xl 
        transition-all 
        shadow-lg 
        shadow-brand-primary/20
        "
      >
        Editar Perfil
      </button>
    </>
  );
};
