import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Airline } from "../types/airline";

interface AirlineStore {
  airlines: Airline[];
  addAirline: (airline: Omit<Airline, "id">) => void;
  removeAirline: (id: string) => void;
  updateAirline: (id: string, updates: Partial<Airline>) => void;
}

export const useAirlineStore = create<AirlineStore>()(
  persist(
    (set) => ({
      airlines: [],
      addAirline: (airline) =>
        set((state) => ({
          airlines: [
            ...state.airlines,
            { ...airline, id: crypto.randomUUID() },
          ],
        })),
      removeAirline: (id) =>
        set((state) => ({
          airlines: state.airlines.filter((airline) => airline.id !== id),
        })),
      updateAirline: (id, updates) =>
        set((state) => ({
          airlines: state.airlines.map((airline) =>
            airline.id === id ? { ...airline, ...updates } : airline
          ),
        })),
    }),
    {
      name: "airline-storage",
    }
  )
);
