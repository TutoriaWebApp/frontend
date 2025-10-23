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
    stars.push(<span key={`empty-${stars.length}`} className="star-empty">☆</span>);
  }
  return stars;
};

export default function TeacherCard({
  nome,
  foto,
  estado,
  cidade,
}: {
  nome?: string;
  foto: string;
  estado: string;
  cidade: string;
}) {

  const especialidades = ["Arte", "Música"]
  
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
           <span className="numero-avaliacoes">({5} avaliações)</span>
         </div>
       </section>

      <p className="professor-descricao">{estado} - {cidade}</p>
         <div className="professor-especialidades">
           {especialidades.map((esp, index) => (
             <span key={index} className="especialidade-tag">
               {esp}
             </span>
           ))}
         </div>
       <footer className="card-footer">
         <button className="btn btn-perfil">Ver Perfil Completo</button>
       </footer>
      </div>
    </>
  );
}


// // ProfessorCard.tsx

// import React from 'react';
// import './teacher-card.css';

// // 1. Interface para definir as props e garantir a tipagem
// interface TeacherCardProps {
//   fotoUrl: string;
//   nome: string;
//   titulo: string;
//   precoHora: number;
//   avaliacao: number; // ex: 4.8
//   numeroAvaliacoes: number;
//   descricao: string;
//   especialidades: string[];
// }

// // Helper para renderizar as estrelas de avaliação
// const renderStars = (rating: number) => {
//   const fullStars = Math.floor(rating);
//   const halfStar = rating % 1 !== 0;
//   const stars = [];

//   for (let i = 0; i < fullStars; i++) {
//     stars.push(<span key={`full-${i}`}>⭐</span>);
//   }
//   if (halfStar) {
//     // Para simplificar, usaremos uma estrela cheia para > .5, mas poderia ser um ícone diferente
//     stars.push(<span key="half">⭐</span>);
//   }
//   // Preencher com estrelas vazias até 5
//   while (stars.length < 5) {
//     stars.push(<span key={`empty-${stars.length}`} className="star-empty">☆</span>);
//   }
//   return stars;
// };

// const ProfessorCard: React.FC<ProfessorCardProps> = ({
//   fotoUrl,
//   nome,
//   titulo,
//   precoHora,
//   avaliacao,
//   numeroAvaliacoes,
//   descricao,
//   especialidades,
// }) => {
//   return (
//     <article className="professor-card">
//       <header className="card-header">
//         <img src={fotoUrl} alt={`Foto de ${nome}`} className="professor-foto" />
//         <h2 className="professor-nome">{nome}</h2>
//         <p className="professor-titulo">{titulo}</p>
//       </header>
      
//       <section className="card-body">
//         <div className="professor-preco">
//           <span>R$ {precoHora.toFixed(2).replace('.', ',')}</span> /h
//         </div>
        
//         <div className="professor-avaliacao">
//           {renderStars(avaliacao)}
//           <span className="numero-avaliacoes">({numeroAvaliacoes} avaliações)</span>
//         </div>
        
//         <p className="professor-descricao">{descricao}</p>
        
//         <div className="professor-especialidades">
//           {especialidades.map((esp, index) => (
//             <span key={index} className="especialidade-tag">
//               {esp}
//             </span>
//           ))}
//         </div>
//       </section>
      
//       <footer className="card-footer">
//         <button className="btn btn-perfil">Ver Perfil Completo</button>
//         <button className="btn btn-mensagem">Enviar Mensagem</button>
//       </footer>
//     </article>
//   );
// };

// export default ProfessorCard;