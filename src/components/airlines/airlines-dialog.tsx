import { useState } from "react";
import { useAirlineStore } from "@/stores/useAirlineStore";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";
import { AirlineForm } from "./airline-form";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

export function AirlinesDialog() {
    const [open, setOpen] = useState(false);
    const [editingAirline, setEditingAirline] = useState<{
        id: string;
        name: string;
        pricePerThousandMiles: number;
    } | null>(null);

    const { airlines, removeAirline } = useAirlineStore();

    const handleDelete = (id: string) => {
        removeAirline(id);
        toast.success("Companhia aérea removida com sucesso!");
    };

    const handleSuccess = () => {
        setEditingAirline(null);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plane className="h-4 w-4 mr-2" />
                    Gerenciar Companhias
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Gerenciar Companhias Aéreas</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {!editingAirline && <AirlineForm onSuccess={handleSuccess} />}

                    {editingAirline && (
                        <div className="space-y-4">
                            <AirlineForm
                                editingAirline={editingAirline}
                                onSuccess={handleSuccess}
                            />
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setEditingAirline(null)}
                            >
                                Cancelar Edição
                            </Button>
                        </div>
                    )}

                    <div className="mt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Companhia</TableHead>
                                    <TableHead>Preço/Mil Milhas</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {airlines.map((airline) => (
                                    <TableRow key={airline.id}>
                                        <TableCell>{airline.name}</TableCell>
                                        <TableCell>
                                            {airline.pricePerThousandMiles.toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => setEditingAirline(airline)}
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(airline.id)}
                                                        className="text-destructive"
                                                    >
                                                        <Trash className="mr-2 h-4 w-4" />
                                                        Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}