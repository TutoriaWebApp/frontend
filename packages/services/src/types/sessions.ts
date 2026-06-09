export interface SessionGetData{
    id: number,
    dataSessao: string,
    horarioInicio: string,
    horarioFim: string,
    usuarioId: number,
    tutorId: number,
    areaId: number,
    especialidadeId: number
}

export interface SessionsGetResult{
    success: boolean;
    status: number;
    data?: {
        count: number;
        next: string;
        previous: string;
        results: SessionGetData[];
    };
}