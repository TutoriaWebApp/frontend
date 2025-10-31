// page.tsx

"use client"

import "./conquistas.css";
import AchievementCard from "@repo/ui/achievement-card/achievement-card";
import { useEffect, useState } from 'react';

interface Conquista {
  id: number;
  urlImagem: string;
  titulo: string;
  descricao: string;
  pontos: number;
}

interface ConquistaObtida {
  titulo: string;
}

export default function Conquistas() {
  const [todasAsConquistas, setTodasAsConquistas] = useState<Conquista[]>([]);
  const [conquistasUsuario, setConquistasUsuario] = useState<ConquistaObtida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Nenhum token encontrado. Por favor, faça o login.');
        setLoading(false);
        return;
      }

      try {
        const idUsuario = JSON.parse(localStorage.getItem("idUsuario")!)
        // Executar ambas as requisições em paralelo
        const [resConquistas, resConsegue] = await Promise.all([
          fetch(`http://localhost:8000/v1/conquistas/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`http://localhost:8000/v1/conquistas/usuario/${idUsuario}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!resConquistas.ok || !resConsegue.ok) {
          throw new Error('Falha ao buscar dados. Sua sessão pode ter expirado.');
        }

        const dataTodasConquistas = await resConquistas.json();
        const dataConquistasUsuario = await resConsegue.json();

        setTodasAsConquistas(dataTodasConquistas);
        setConquistasUsuario(dataConquistasUsuario);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); 

  const conquistasObtidas = new Set(conquistasUsuario.map(c => c.titulo));

  if (loading) {
    return <div className="achievements-status"><h1>Carregando conquistas...</h1></div>;
  }

  if (error) {
    return <div className="achievements-status error"><h1>Erro: {error}</h1></div>;
  }

  return (
    <div className="achievements">
      <h1 className="achievements-header">Conquistas</h1>
      
      {todasAsConquistas.map((achievement) => {
        const estaBloqueada = !conquistasObtidas.has(achievement.titulo);
        
        return (
          <AchievementCard
            key={achievement.id}
            img={achievement.urlImagem} 
            title={achievement.titulo}
            description={achievement.descricao}
            points={achievement.pontos}
            locked={estaBloqueada} 
          />
        );
      })}
    </div>
  );
}