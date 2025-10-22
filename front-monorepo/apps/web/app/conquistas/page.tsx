import "./conquistas.css";
import AchievementCard from "@repo/ui/achievement-card/achievement-card";

// Mock de todas as conquistas disponíveis no banco
const arrayConquistas = [
  {
    id: 1,
    img: "https://i.imgur.com/s6c86p1.png", 
    title: "A Primeira de Muitas!",
    description: "Concluiu sua primeira sessão de tutoria.",
    points: 10,
  },
  {
    id: 2,
    img: "https://i.imgur.com/O6qjO8c.png", 
    title: "Quebrando o gelo!",
    description: "Mande uma mensagem para um tutor no chat.",
    points: 10,
  },
  {
    id: 3,
    img: "https://i.imgur.com/3wS3t2c.png",
    title: "Bem na fita!",
    description: "Receba uma avaliação de 4 estrelas ou mais.",
    points: 10,
  },
  {
    id: 4,
    img: "https://i.imgur.com/bX6t7hD.png",
    title: "O Primeiro Passo...",
    description: "Solicite uma sessão de tutoria.",
    points: 10,
  },
];

// Mock das conquistas que o usuário já obteve 
const arrayConquistasObtidas = [
  {
    id: 4,
    title: "O Primeiro Passo...",
    description: "Solicite uma sessão de tutoria.",
    points: 10,
  },
  {
    id: 1,
    title: "A Primeira de Muitas!",
    description: "Concluiu sua primeira sessão de tutoria.",
    points: 10,
  },
];

export default function Conquistas() {
  // Set com IDs das conquistas obtidas para verificaçao rápida e eficiente
  const idsConquistasObtidas = new Set(arrayConquistasObtidas.map(c => c.id));

  return (
    <div className="achievements">
      <h1 className="achievements-header">Conquistas</h1>
      
      {/* Método .map() para iterar sobre todas as conquistas disponíveis */}
      {arrayConquistas.map((conquista) => {
        
        // 3. Verificando se o ID da conquista atual está no Set de conquistas obtidas.
        // Se NÃO estiver, ela está "trancada" (locked = true).
        const estaBloqueada = !idsConquistasObtidas.has(conquista.id);

        return (
          <AchievementCard
            key={conquista.id}
            img={conquista.img}
            title={conquista.title}
            description={conquista.description}
            points={conquista.points}
            locked={estaBloqueada} 
          />
        );
      })}
    </div>
  );
}