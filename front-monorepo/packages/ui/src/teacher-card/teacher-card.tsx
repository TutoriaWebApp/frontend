import "./teacher-card.css";

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={`full-${i}`}>⭐</span>);
  }
  if (halfStar) {
    // Para simplificar, usaremos uma estrela cheia para > .5, mas poderia ser um ícone diferente
    stars.push(<span key="half">⭐</span>);
  }
  // Preencher com estrelas vazias até 5
  while (stars.length < 5) {
    stars.push(
      <span key={`empty-${stars.length}`} className="star-empty">
        ☆
      </span>
    );
  }
  return stars;
};

export default function TeacherCard({
  id,
  nome,
  foto,
  estado,
  cidade,
  onAgendarClick,
}: {
  id: number;
  nome?: string;
  foto: string;
  estado: string;
  cidade: string;
  onAgendarClick: (id: number) => void;
}) {
  const especialidades = ["Arte", "Música"];

  return (
    <>
      <div className="professor-card">
        <header className="card-header">
          <img src={foto} alt={`Foto de ${nome}`} className="professor-foto" />
          <h2 className="professor-nome">{nome}</h2>
        </header>

        <section className="card-body">
          <div className="professor-avaliacao">
            {renderStars(5)}
            {/* <span className="numero-avaliacoes">({5} avaliações)</span> */}
          </div>
        </section>

        {/* <p className="professor-descricao">{estado} - {cidade}</p> */}
        <div className="professor-especialidades">
          {especialidades.map((esp, index) => (
            <span key={index} className="especialidade-tag">
              {esp}
            </span>
          ))}
        </div>
        <footer className="card-footer">
          <button className="btn btn-perfil">Ver Perfil Completo</button>
          <button className="btn btn-sessao" onClick={() => onAgendarClick(id)}>
            Solicitar Sessão de Agendamento
          </button>{" "}
        </footer>
      </div>
    </>
  );
}
