import { CityResult } from "./types/cities";

export async function GetCities(UF: string): Promise<CityResult[] | string> {
  const URL = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UF}/municipios`;

  try {
    const response = await fetch(URL);

    const data = await response.json();

    let concatArray: CityResult[] = [];

    for(const element of data){
        concatArray = concatArray.concat(element);
    }

    return data;

  } catch (error) {
    console.error("Erro em acesso à API do IBGE:", error);
    return "Não foi possível obter a lista de cidades do estado."; 
  }
}