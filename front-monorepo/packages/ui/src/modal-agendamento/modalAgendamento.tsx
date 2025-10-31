// ModalAgendamento.tsx

import React, { useEffect, useState } from "react";
import "./modalAgendamento.css";

// 1. Definir interfaces para a tipagem dos dados
interface Sessao {
  id: number;
  tutorId: number;
  dia: string; // "SEG", "TER", etc.
  horarioInicio: string;
  horarioFim: string;
}

// Usamos um Record para agrupar as sessões por dia
type SessoesAgrupadas = Record<string, Sessao[]>;

interface ModalProps {
  tutorId: number;
  onClose: () => void;
}

const ModalAgendamento: React.FC<ModalProps> = ({ tutorId, onClose }) => {
  const [sessoesAgrupadas, setSessoesAgrupadas] = useState<SessoesAgrupadas>(
    {}
  );
  const [activeTab, setActiveTab] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndProcessSessoes = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Nenhum token encontrado. Por favor, faça o login.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/v1/sessoes/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Falha ao buscar dados das sessões.");
        }

        const todasAsSessoes: Sessao[] = await response.json();

        // 2. Filtrar sessões APENAS para o tutorId recebido
        const sessoesDoTutor = todasAsSessoes.filter(
          (sessao) => sessao.tutorId === tutorId
        );

        // 3. Agrupar as sessões filtradas por dia
        const grupos: SessoesAgrupadas = sessoesDoTutor.reduce(
          (acc, sessao) => {
            const dia = sessao.dia;
            if (!acc[dia]) {
              acc[dia] = [];
            }
            acc[dia].push(sessao);
            return acc;
          },
          {} as SessoesAgrupadas
        );

        setSessoesAgrupadas(grupos);

        // Define a primeira aba como ativa, se houver alguma
        const diasDisponiveis = Object.keys(grupos);
        if (diasDisponiveis.length > 0) {
          setActiveTab(diasDisponiveis[0]!);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessSessoes();
  }, [tutorId]);

const makeSolicitation = async (sessaoId: number) => {
    // 1. Pega o ID do usuário e o token do localStorage
    const idUserString = localStorage.getItem("idUsuario");
    const token = localStorage.getItem("token");

    if (!token || !idUserString) {
      setError("Usuário não autenticado. Por favor, faça o login.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/v1/consegue/add/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          "usuarioId": parseInt(idUserString, 10),
          "conquistaId": 1
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Falha ao solicitar a sessão.");
      } else {
        alert(`Sessão ${sessaoId} solicitada com sucesso!`);
        alert(`Conquista "O primeiro passo!" desbloqueada!`);
        onClose(); 
      }
    } catch (err: any) {
      setError(err.message);
      alert(`Erro: ${err.message}`); 
    }
};

  const dias = Object.keys(sessoesAgrupadas);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Agendar Sessão de Tutoria</h2>
          <button onClick={onClose} className="modal-close-button">
            &times;
          </button>
        </header>

        <main className="modal-body">
          {loading && <p>Carregando horários...</p>}
          {error && <p className="error-message">{error}</p>}

          {!loading &&
            !error &&
            (dias.length > 0 ? (
              <>
                <div className="tabs-container">
                  {dias.map((dia) => (
                    <button
                      key={dia}
                      className={`tab ${activeTab === dia ? "active" : ""}`}
                      onClick={() => setActiveTab(dia)}
                    >
                      {dia}
                    </button>
                  ))}
                </div>
                <div className="sessions-list">
                  {sessoesAgrupadas[activeTab]?.map((sessao) => (
                    <div
                      key={sessao.id}
                      className="session-item"
                      onClick={() => makeSolicitation(sessao.id)}
                    >
                      <span className="session-time">
                        Das {sessao.horarioInicio.substring(0, 5)}
                      </span>
                      <span>às {sessao.horarioFim.substring(0, 5)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>Nenhum horário de sessão encontrado para este tutor.</p>
            ))}
        </main>
      </div>
    </div>
  );
};

export default ModalAgendamento;
