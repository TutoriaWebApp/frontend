import { HolidayResult } from "./types/holidays";

export async function GetHolidays(year: number): Promise<HolidayResult> {
  const URL = `https://brasilapi.com.br/api/feriados/v1/${year}`;

  try {
    const response = await fetch(URL);

    if(response.ok){
        const data = await response.json();
         
        return{
            success: true,
            status: response.status,
            data: data
        }
    }
    else{
        return{
            success: false,
            status: response.status
        }
    }
  } 
  catch (error) {
    return {
        success: false,
        status: 500
    }
  }
}