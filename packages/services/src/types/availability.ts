export interface TimeSlot{
  id?: number,
  horarioInicio: string,
  horarioFim: string,
  dia: 'SEG' | 'TER' | 'QUA' | 'QUI' | 'SEX' | 'SAB' | 'DOM',
  tutorId?: number
}

export interface GetScheduleResult {
  success: boolean;
  status: number;
  data?: TimeSlot[];
}