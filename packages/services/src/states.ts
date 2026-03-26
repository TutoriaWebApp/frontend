import { StateResult } from "./types/states";

export async function GetStates(): Promise<StateResult[] | string> {
  const URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome';

  try {
    const response = await fetch(URL);

    const data = await response.json();

    return data;

  } catch (error) {
    console.error("Erro em acesso à API do IBGE:", error);
    return "Não foi possível obter a lista de estados."; 
  }
}