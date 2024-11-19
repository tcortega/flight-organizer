// components/flights/WorkspaceManager.tsx
import { useEffect, useState } from "react";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Flight } from "@/types/flight";
import { AirlinesDialog } from "../airlines/airlines-dialog";
import { FlightTable } from "./flight-table";
import { FlightForm } from "./flight-form";

export function WorkspaceManager() {
    const [isFlightDialogOpen, setIsFlightDialogOpen] = useState(false);
    const [editingFlight, setEditingFlight] = useState<Flight | undefined>();

    const {
        workspaces,
        activeWorkspaceId,
        importWorkspace,
        setActiveWorkspace
    } = useWorkspaceStore();

    // Handle shared workspace import
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedWorkspace = urlParams.get('workspace');

        if (sharedWorkspace) {
            const result = importWorkspace(sharedWorkspace);

            if (result.success) {
                // Clear the URL parameter after successful import
                urlParams.delete('workspace');
                window.history.replaceState({}, '', `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`);
                toast.success("Plano de viagem importado com sucesso!");
            } else {
                toast.error(result.error || "Erro ao importar plano de viagem");
            }
        }
    }, []);

    // Set first workspace as active if none is selected
    useEffect(() => {
        if (workspaces.length > 0 && !activeWorkspaceId) {
            setActiveWorkspace(workspaces[0].id);
        }
    }, [workspaces, activeWorkspaceId]);

    const handleEditFlight = (flightId: string) => {
        const workspace = workspaces.find(w => w.id === activeWorkspaceId);
        const flight = workspace?.flights.find(f => f.id === flightId);

        if (flight) {
            setEditingFlight(flight);
            setIsFlightDialogOpen(true);
        }
    };

    const handleFlightFormSuccess = () => {
        setIsFlightDialogOpen(false);
        setEditingFlight(undefined);
    };

    const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);

    if (workspaces.length === 0) {
        return (
            <Card className="p-8">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-semibold">Bem-vindo ao Planejador de Viagens</h2>
                    <p className="text-muted-foreground">
                        Comece criando seu primeiro plano de viagem
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <AirlinesDialog />

                    <Dialog open={isFlightDialogOpen} onOpenChange={setIsFlightDialogOpen}>
                        <DialogTrigger asChild>
                            <Button disabled={!activeWorkspaceId} size="sm" className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Novo Voo
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingFlight ? "Editar Voo" : "Adicionar Novo Voo"}
                                </DialogTitle>
                            </DialogHeader>
                            <FlightForm
                                editingFlight={editingFlight}
                                onSuccess={handleFlightFormSuccess}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {activeWorkspace && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            {activeWorkspace.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Total de voos: {activeWorkspace.flights.length}
                        </p>
                    </div>

                    <FlightTable onEdit={handleEditFlight} />
                </div>
            )}
        </div>
    );
}