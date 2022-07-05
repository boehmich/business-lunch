export interface Invoice {
  id: string;
  restaurant: string;
  date: string;
  amount: number;
  imagePath: string;
  creator: string | null;
}
