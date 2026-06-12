"use client";

import { useState, useContext } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { NotificationContext } from "../../contexts/NotificationContext/NotificationContext";
import { RejectSolicitationAction } from "@repo/services/solicitationsAction";
import { SolicitationGetData } from "@repo/services/solicitationTypes";
import { ClipLoader } from "react-spinners";

interface RejectSolicitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  solicitation: SolicitationGetData | null;
  setSolicitationsList: React.Dispatch<React.SetStateAction<SolicitationGetData[]>>;
}

export function RejectSolicitationModal({
  isOpen,
  onClose,
  solicitation,
  setSolicitationsList,
}: RejectSolicitationModalProps) {
  const { showNotification } = useContext(NotificationContext);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !solicitation) return null;

  const handleConfirmReject = async () => {
    setLoading(true);
    try {
      const res = await RejectSolicitationAction(solicitation.id);

      if (res.success) {
        setSolicitationsList((prevList) =>
          prevList.filter((item) => item.id !== solicitation.id)
        );
        
        showNotification("Solicitação recusada com sucesso!", "success");
        onClose();
      } else {
        showNotification("Não foi possível recusar a solicitação.", "error");
      }
    } catch (error) {
        showNotification("Ocorreu um erro no sistema.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
      fixed 
      inset-0 
      z-50 
      flex 
      items-center 
      justify-center 
      bg-black/50 
      p-4 
      animate-fade-in
    ">
      <div className="
        bg-white 
        rounded-2xl 
        w-full 
        max-w-md 
        shadow-2xl 
        overflow-hidden 
        transform 
        transition-all 
        border 
        border-slate-100
      ">  
        {/* Header */}
        <div className="
          p-6 
          pb-4 
          flex 
          justify-between 
          items-center 
          border-b 
          border-slate-100
        ">
          <h3 className="
            text-lg 
            font-black 
            text-slate-800
          ">
            Recusar Solicitação
          </h3>
          <button
            onClick={onClose}
            className="
              p-1 
              rounded-lg 
              text-slate-400 
              hover:bg-slate-100 
              hover:text-slate-600 
              transition-all 
              cursor-pointer
            "
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Body */}
        <div className="
          p-6 
          text-sm 
          text-slate-600 
          space-y-2
        ">
          <p>
            Você tem certeza que deseja recusar a solicitação de tutoria?
          </p>
        </div>

        <div className="
          p-6 
          bg-slate-50 
          flex 
          justify-end 
          gap-3 
          border-t 
          border-slate-100
        ">
          <button
            disabled={loading}
            onClick={handleConfirmReject}
            className="
              px-6 
              py-2 
              rounded-xl 
              font-bold 
              text-sm 
              bg-red-600 
              text-white 
              shadow-lg 
              shadow-red-600/10 
              hover:bg-red-700 
              transition-all 
              cursor-pointer 
              flex 
              items-center 
              justify-center 
              gap-2 
              disabled:opacity-50 
              min-w-[100px]
            "
          >
            {loading ? (
              <ClipLoader size={16} color="#ffffff" />
            ) : (
              "Recusar"
            )}
          </button>
          <button
            disabled={loading}
            onClick={onClose}
            className="
              px-5 
              py-2 
              rounded-xl 
              font-bold 
              text-sm 
              bg-slate-200 
              text-slate-500 
              hover:bg-slate-300 
              hover:text-slate-700 
              transition-all 
              cursor-pointer 
              disabled:opacity-50
            "
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}