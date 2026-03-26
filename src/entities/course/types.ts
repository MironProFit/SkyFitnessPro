export interface DailyDuration {
  from: number;
  to: number;
}

export interface ICourse {
  _id: string;
  nameRU: string;
  nameEN: string;
  description: string;
  directions: string[];
  fitting: string[];
  difficulty: string;
  durationInDays: number;
  dailyDurationInMinutes: DailyDuration;
  workouts: string[];
  order: number;
  __v?: number;
}
