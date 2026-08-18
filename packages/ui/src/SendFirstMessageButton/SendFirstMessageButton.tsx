"use client";

import { useState } from "react";

import { SendFirstMessageModal } from "../Modals/SendFirstMessage/SendFirstMessage";

interface SendFirstMessageButtonProps {
  tutorName: string;
  tutorId: number;
}

export function SendFirstMessageButton({
  tutorName,
  tutorId
}: SendFirstMessageButtonProps){ 

  const [changePasswordModalIsOpen, setChangePasswordModalIsOpen] =
    useState(false);

  const openChangePasswordModal = () => setChangePasswordModalIsOpen(true);
  const closeChangePasswordModal = () => setChangePasswordModalIsOpen(false);

  return (
    <>
      <button
        onClick={openChangePasswordModal}
        className="
        w-fit
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
        Enviar Mensagem
      </button>
      <SendFirstMessageModal
        tutorName={tutorName}
        tutorId={tutorId}
        isOpen={changePasswordModalIsOpen}
        onClose={closeChangePasswordModal}
      />
    </>
  );
};
