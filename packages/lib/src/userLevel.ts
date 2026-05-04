// Lista de XP Total Acumulado extraída da sua Tabela de Progressão
const levelThresholds = [
  100, 201, 302, 403, 504, 705, 1006, 1407, 1908, 2509, // Níveis 1-10 
  3210, 4011, 4912, 5913, 7014, 8215, 9516, 10917, 12418, 14019, // Níveis 11-20 
  15720, 17521, 19422, 21423, 23524, 25725, 28026, 30427, 32928, 35529, // Níveis 21-30 
  38230, 41031, 43932, 46933, 50034, 53235, 56536, 59937, 63438, 67039, // Níveis 31-40 
  70740, 74541, 78442, 82443, 86544, 90745, 95046, 99447, 103948, 108549 // Níveis 41-50 
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