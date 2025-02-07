export interface Flight {
  id: string;
  origin: string;
  destination: string;
  date: string;
  airline: string;
  miles: number;
  price: string;
  ticketLink: string;
  useDirectPrice: boolean;
  taxes?: string;
}
