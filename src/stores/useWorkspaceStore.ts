import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Flight } from "@/types/flight";
import { Result } from "@/types/result";
import { ShareableWorkspace, Workspace } from "@/types/workspace";

interface WorkspaceStore {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  setActiveWorkspace: (id: string) => void;
  addWorkspace: (workspace: Omit<Workspace, "id" | "createdAt">) => void;
  removeWorkspace: (id: string) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  addFlight: (workspaceId: string, flight: Omit<Flight, "id">) => void;
  removeFlight: (workspaceId: string, flightId: string) => void;
  updateFlight: (
    workspaceId: string,
    flightId: string,
    updates: Partial<Flight>
  ) => void;
  importWorkspace: (workspaceData: string) => Result<void>;
  exportWorkspace: (id: string) => Result<string>;
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set, get) => ({
      workspaces: [],
      activeWorkspaceId: null,

      setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),

      addWorkspace: (workspace) =>
        set((state) => ({
          workspaces: [
            ...state.workspaces,
            {
              ...workspace,
              id: crypto.randomUUID(),
              createdAt: Date.now(),
            },
          ],
        })),

      removeWorkspace: (id) =>
        set((state) => ({
          workspaces: state.workspaces.filter((w) => w.id !== id),
          activeWorkspaceId:
            state.activeWorkspaceId === id ? null : state.activeWorkspaceId,
        })),

      updateWorkspace: (id, updates) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === id ? { ...workspace, ...updates } : workspace
          ),
        })),

      addFlight: (workspaceId, flight) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === workspaceId
              ? {
                  ...workspace,
                  flights: [
                    ...workspace.flights,
                    { ...flight, id: crypto.randomUUID() },
                  ],
                }
              : workspace
          ),
        })),

      removeFlight: (workspaceId, flightId) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === workspaceId
              ? {
                  ...workspace,
                  flights: workspace.flights.filter(
                    (flight) => flight.id !== flightId
                  ),
                }
              : workspace
          ),
        })),

      updateFlight: (workspaceId, flightId, updates) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === workspaceId
              ? {
                  ...workspace,
                  flights: workspace.flights.map((flight) =>
                    flight.id === flightId ? { ...flight, ...updates } : flight
                  ),
                }
              : workspace
          ),
        })),

      importWorkspace: (workspaceData) => {
        try {
          const decoded = atob(workspaceData);
          const parsed = JSON.parse(decoded) as ShareableWorkspace;

          // Validate version and structure
          if (
            !parsed.version ||
            !parsed.name ||
            !Array.isArray(parsed.flights)
          ) {
            return { success: false, error: "Invalid workspace data format" };
          }

          // Create new workspace from imported data
          get().addWorkspace({
            name: parsed.name,
            flights: parsed.flights.map((flight) => ({
              ...flight,
              id: crypto.randomUUID(),
            })),
          });

          return { success: true };
        } catch (error) {
          return {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to import workspace",
          };
        }
      },

      exportWorkspace: (id) => {
        const workspace = get().workspaces.find((w) => w.id === id);

        if (!workspace) {
          return { success: false, error: "Workspace not found" };
        }

        try {
          const shareableData: ShareableWorkspace = {
            name: workspace.name,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            flights: workspace.flights.map(({ id, ...flight }) => flight),
            version: 1,
          };

          const encoded = btoa(JSON.stringify(shareableData));
          return { success: true, data: encoded };
        } catch (error) {
          return {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to export workspace",
          };
        }
      },
    }),
    {
      name: "workspace-storage",
    }
  )
);
