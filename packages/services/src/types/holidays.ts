interface HolidayData {
  date: string;
  name: string;
  type: string;
  weekday: string;
}

export interface HolidayResult{
    success: boolean;
    status: number;
    data?: HolidayData[];
}