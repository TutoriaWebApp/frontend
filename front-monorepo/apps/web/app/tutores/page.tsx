"use client"

import "./tutores.css";
import TeacherCard from "@repo/ui/teacher-card/teacher-card";
import { useEffect, useState } from 'react';

interface TutorResponse {
  id: number;
  usuarioId: number;
}

interface Usuario {
  id: number;
  nomePerfil: string;
  urlFoto: string;
  cidade: string;
  estado: string;
  pontuacao: number;
  email: string;
}

export default function Tutores() {
  const [tutores, setTutores] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllTutorData = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Nenhum token encontrado. Por favor, faça o login.');
        setLoading(false);
        return;
      }

      try {
        const tutoresResponse = await fetch('http://localhost:8000/v1/tutores/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!tutoresResponse.ok) {
          throw new Error('Falha ao buscar a lista de tutores.');
        }

        const tutoresData: TutorResponse[] = await tutoresResponse.json();

        if (tutoresData.length === 0) {
          setLoading(false);
          return;
        }

        const userProfilePromises = tutoresData.map(tutor => {
          return fetch(`http://localhost:8000/v1/usuarios/${tutor.usuarioId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }).then(res => {
            if (!res.ok) {
              throw new Error(`Falha ao buscar dados do usuário ${tutor.usuarioId}.`);
            }
            return res.json();
          });
        });

        const finalUserProfiles: Usuario[] = await Promise.all(userProfilePromises);

        setTutores(finalUserProfiles);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTutorData();
  }, []); // O array vazio garante que isso rode apenas uma vez

  if (loading) {
    return <div className="achievements-status"><h1>Carregando tutores...</h1></div>;
  }

  if (error) {
    return <div className="achievements-status error"><h1>Erro: {error}</h1></div>;
  }

  return (
    <div className="teachers">
      <h1 className="teachers-header">Tutores</h1>
      
      <div className="teachers-grid">
        {tutores.map((tutor) => (
          <TeacherCard
            key={tutor.id}
            nome={tutor.nomePerfil}
            foto={tutor.urlFoto}
            estado={tutor.estado}
            cidade={tutor.cidade}
          />
        ))}
      </div>
    </div>
  );
}