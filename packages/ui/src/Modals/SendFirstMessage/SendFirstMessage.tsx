"use client";

import { useState, useContext, FormEvent } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { NotificationContext } from "../../contexts/NotificationContext/NotificationContext";
import { CreateChatAction } from "@repo/services/chatAction"
import {CreateChatResult} from "@repo/services/chatTypes"

interface SendFirstMessageModalProps {
  tutorName: string;
  tutorId: number;
  isOpen: boolean;
  onClose: () => void;
}

const MAX_CHARS = 200;

export function SendFirstMessageModal({
  tutorName,
  tutorId,
  isOpen,
  onClose,
}: SendFirstMessageModalProps) {
  const [message, setMessage] = useState<string>("");
  const { showNotification } = useContext(NotificationContext);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!message.trim()){
      return;
    }
    
    const res: CreateChatResult  = await CreateChatAction(tutorId, message);

    if(res.success){
      showNotification("Chat criado com sucesso!", "success");
      onClose();
    }
    else{
      if(res.status != 500)
        showNotification("Ocorreu um erro na criação do chat. Tente novamente.", "error");
      else
        showNotification("Ocorreu um erro no servidor. Não foi possível criar o chat.", "error");
    }

  };

  const remainingChars = MAX_CHARS - message.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Enviar Mensagem</h2>
          <button
            onClick={handleClose}
            type="button"
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-4">
            <p className="text-slate-600 text-sm leading-relaxed">
              Para enviar uma mensagem para{" "}
              <strong className="text-slate-900 font-bold">{tutorName}</strong>
              , escreva no espaço abaixo e clique em{" "}
              <strong className="text-slate-900 font-bold">'Enviar'</strong>. Isso
              vai iniciar um chat entre vocês.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Para ver e enviar mensagens nessa e outras conversas, acesse a página de chats através do botão <strong className="text-slate-900 font-bold">'Chat'</strong> no menu.
            </p>


            <div className="flex flex-col gap-1.5">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={MAX_CHARS}
                placeholder="Escreva sua mensagem aqui!"
                rows={5}
                className="
                  resize-none
                  w-full
                  p-3.5
                  text-slate-800
                  placeholder:text-slate-400
                  rounded-xl
                  border
                  border-slate-200
                  focus:border-brand-primary
                  focus:ring-2
                  focus:ring-brand-primary/20
                  focus:outline-none
                  transition-all
                  bg-slate-50/50
                "
              />

              {/* Contador de Caracteres Dinâmico */}
              <div className="flex justify-end">
                <span
                  className={`text-xs font-medium transition-colors ${
                    remainingChars <= 20
                      ? "text-amber-600 font-semibold"
                      : "text-slate-400"
                  }`}
                >
                  {remainingChars}{" "}
                  {remainingChars === 1
                    ? "caractere restante"
                    : "caracteres restantes"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-50/80 flex justify-end items-center gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="
                px-6 
                py-2.5 
                rounded-xl 
                font-bold
                bg-slate-200/80
                text-slate-600 
                hover:bg-slate-300
                hover:text-slate-800 
                transition-all
              "
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!message.trim()}
              className="
                px-8 
                py-2.5 
                rounded-xl 
                bg-brand-primary 
                text-white 
                font-bold 
                shadow-lg 
                shadow-brand-primary/20 
                hover:bg-indigo-800
                disabled:opacity-40
                disabled:cursor-not-allowed
                disabled:shadow-none
                transition-all
              "
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}