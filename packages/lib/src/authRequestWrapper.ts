import { cookies } from "next/headers";
import { isTokenExpired } from './jwtAux';

interface reqParamsData{
    method: string,
    headers?: {},
    body?: string
}

interface authRequestResponseData{
    success: boolean;
    status: number;
    data: {mensagem: string};
}

export const authRequestWrapper =  async(URL: string, reqParams: reqParamsData, requestName: string): Promise<authRequestResponseData> => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('access_token')?.value;

    if(!accessToken || isTokenExpired(accessToken)) {
        return {success: false, status: 401, data:{mensagem: "Token inexistente ou inválido."}};
    }

    try{
        const response = await fetch(URL, {
            ...reqParams,
            credentials: 'include'
        });

        const data = await response.json();

        if(response.ok){
            return {success: true, status: response.status, data};
        }
        else{
            return {success: false, status: response.status, data};
        }

    }
    catch(error){
        console.error(`${requestName} Request Service Error:`, error);
        return {success: false, status: 500, data: {mensagem: "Não foi possível conectar ao servidor!"}};
    }
}