import React, { useEffect, useState } from "react";
import "./modalAgendamento.css";

interface Sessao {
  id: number;
  tutorId: number;
  dia: string;
  horarioInicio: string;
  horarioFim: string;
}

interface Solicitacao {
  id: number;
  dataCriacao: string;
  validade: string;
  estado: string;
  usuarioId: number;
  sessaoId: number;
}

type SessoesAgrupadas = Record<string, Sessao[]>;

interface ModalProps {
  tutorId: number;
  onClose: () => void;
}

const ModalAgendamento: React.FC<ModalProps> = ({ tutorId, onClose }) => {
  const [sessoesAgrupadas, setSessoesAgrupadas] = useState<SessoesAgrupadas>({});
  const [activeTab, setActiveTab] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const idUserString = localStorage.getItem("idUsuario"); 

      if (!token || !idUserString) {
        setError("Usuário não autenticado. Por favor, faça o login.");
        setLoading(false);
        return;
      }

      const currentUserId = parseInt(idUserString, 10);

      try {
        const [resSessoes, resSolicitacoes] = await Promise.all([
          fetch(`http://localhost:8000/v1/sessoes/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:8000/v1/solicitacao/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!resSessoes.ok || !resSolicitacoes.ok) {
          throw new Error("Falha ao buscar dados das sessões ou solicitações.");
        }

        const todasAsSessoes: Sessao[] = await resSessoes.json();
        const todasAsSolicitacoes: Solicitacao[] =
          await resSolicitacoes.json();

        const sessoesSolicitadasPeloUsuario = new Set(
          todasAsSolicitacoes
            .filter((sol) => sol.usuarioId === currentUserId)
            .map((sol) => sol.sessaoId)
        );

        const sessoesDisponiveis = todasAsSessoes.filter(
          (sessao) =>
            sessao.tutorId === tutorId &&
            !sessoesSolicitadasPeloUsuario.has(sessao.id)
        );

        const grupos: SessoesAgrupadas = sessoesDisponiveis.reduce(
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

    fetchAllData();
  }, [tutorId]); 

  const makeSolicitation = async (sessaoId: number) => {
    const idUserString = localStorage.getItem("idUsuario");
    const token = localStorage.getItem("token");

    if (!token || !idUserString) {
      setError("Usuário não autenticado. Por favor, faça o login.");
      return;
    }

    try {
      const resSolicitacao = await fetch(
        "http://localhost:8000/v1/solicitacao/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sessaoId: sessaoId,
          }),
        }
      );

      if (!resSolicitacao.ok) {
        const errorData = await resSolicitacao.json();
        throw new Error(errorData.detail || "Falha ao solicitar a sessão.");
      }

      alert(`Solicitação de sessão feita com sucesso!`);

      try {
        const resConquista = await fetch(
          "http://localhost:8000/v1/consegue/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              usuarioId: parseInt(idUserString, 10),
              conquistaId: 1,
            }),
          }
        );

        if (resConquista.ok) {
          alert(`Conquista "O primeiro passo!" desbloqueada!`);
        } else {
          console.warn("Não foi possível desbloquear a conquista.");
        }
      } catch (conquistaError) {
        console.warn("Erro ao tentar desbloquear conquista:", conquistaError);
      }

      onClose();
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
              <p>Nenhum horário disponível encontrado para este tutor.</p>
            ))}
        </main>
      </div>
    </div>
  );
};

export default ModalAgendamento;