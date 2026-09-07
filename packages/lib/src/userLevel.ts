// Lista de XP Total Acumulado extraída da sua Tabela de Progressão
export const levelThresholds = [
  // Níveis 1-10: Onboarding Rápido (Primeiras mensagens, perfil e primeiras aulas)
  100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250,

  // Níveis 11-20: Engajamento Médio (Conquistas de Prata e 15 a 30 aulas)
  3850, 4500, 5200, 5950, 6750, 7600, 8500, 9450, 10450, 11500,

  // Níveis 21-30: Usuário Avançado (Início das conquistas de Ouro e 50+ aulas)
  12600, 13750, 14950, 16200, 17500, 18850, 20250, 21700, 23200, 24750,

  // Níveis 31-40: Veterano (Conquistas difíceis e 100+ aulas)
  26350, 28000, 29700, 31450, 33250, 35100, 37000, 38950, 40950, 43000,

  // Níveis 41-50: Grind Supremo (Quase 100% de conquistas + 200-300 aulas)
  45100, 47250, 49450, 51700, 54000, 56350, 58750, 61200, 63700, 66250
];

export const userLevel = (xp: number): number => {
  // Percorre os limites para encontrar o primeiro onde o XP do usuário se encaixa
  for (let i = 0; i < levelThresholds.length; i++) {
    if (xp <= levelThresholds[i]!) {
      return i + 1; 
    }
  }
  
  // Caso o XP ultrapasse o limite do nível 50
  return 50; 
};