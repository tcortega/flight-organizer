import { Flight } from "./flight";

export interface Workspace {
  id: string;
  name: string;
  flights: Flight[];
  createdAt: number;
}

export interface ShareableWorkspace {
  name: string;
  flights: Omit<Flight, "id">[];
  version: number;
}
