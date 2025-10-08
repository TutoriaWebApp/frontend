// Exemplo de uma função utilitária
export const formatarData = (data: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(data);
};