import { useState } from "react";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, MoreHorizontal, Share2, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface SidebarContentProps {
    onSelect?: () => void;
}

export function SidebarContent({ onSelect }: SidebarContentProps) {
    const [isNewWorkspaceDialogOpen, setIsNewWorkspaceDialogOpen] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState("");

    const {
        workspaces,
        activeWorkspaceId,
        setActiveWorkspace,
        addWorkspace,
        removeWorkspace,
        exportWorkspace,
    } = useWorkspaceStore();

    const handleCreateWorkspace = () => {
        if (!newWorkspaceName.trim()) {
            toast.error("Nome do plano é obrigatório");
            return;
        }

        addWorkspace({
            name: newWorkspaceName.trim(),
            flights: [],
        });

        setNewWorkspaceName("");
        setIsNewWorkspaceDialogOpen(false);
    };

    const handleShareWorkspace = (workspaceId: string) => {
        const result = exportWorkspace(workspaceId);

        if (result.success && result.data) {
            const shareUrl = `${window.location.origin}?workspace=${result.data}`;
            navigator.clipboard.writeText(shareUrl);
            toast.success("Link copiado para a área de transferência!");
        } else {
            toast.error("Erro ao compartilhar plano");
        }
    };

    const handleDeleteWorkspace = (workspaceId: string) => {
        removeWorkspace(workspaceId);
        toast.success("Plano removido com sucesso!");
    };

    const handleWorkspaceSelect = (workspaceId: string) => {
        setActiveWorkspace(workspaceId);
        onSelect?.();
    };

    return (
        <div className="flex h-full flex-col">
            <ScrollArea className="flex-1">
                <div className="space-y-1 p-2">
                    {workspaces.map((workspace) => (
                        <div key={workspace.id} className="flex items-center gap-2">
                            <Button
                                variant={workspace.id === activeWorkspaceId ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start",
                                    workspace.id === activeWorkspaceId && "font-medium"
                                )}
                                onClick={() => handleWorkspaceSelect(workspace.id)}
                            >
                                {workspace.name}
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleShareWorkspace(workspace.id)}>
                                        <Share2 className="mr-2 h-4 w-4" />
                                        Compartilhar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleDeleteWorkspace(workspace.id)}
                                        className="text-destructive"
                                    >
                                        <Trash className="mr-2 h-4 w-4" />
                                        Excluir
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="p-4 border-t">
                <Dialog open={isNewWorkspaceDialogOpen} onOpenChange={setIsNewWorkspaceDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Plano
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Criar Novo Plano de Viagem</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome do Plano</Label>
                                <Input
                                    id="name"
                                    value={newWorkspaceName}
                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                    placeholder="Ex: Férias 2024"
                                />
                            </div>
                            <Button onClick={handleCreateWorkspace} className="w-full">
                                Criar Plano
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

export function Sidebar() {
    return (
        // Only show on desktop
        <div className="hidden border-r bg-background md:flex md:w-64 md:flex-col">
            <SidebarContent />
        </div>
    );
}