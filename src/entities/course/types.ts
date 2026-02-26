export interface ICourse {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  lessons: number[]; // IDs of lessons
}