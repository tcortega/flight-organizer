import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
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
import { Button } from "@/components/ui/button";
import { ExternalLink, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

interface FlightTableProps {
  onEdit?: (flightId: string) => void;
}

export function FlightTable({ onEdit }: FlightTableProps) {
  const { workspaces, activeWorkspaceId, removeFlight } = useWorkspaceStore();

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  if (!activeWorkspace) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Selecione um plano de viagem para visualizar os voos
      </div>
    );
  }

  const handleDelete = (flightId: string) => {
    removeFlight(activeWorkspace.id, flightId);
    toast.success("Voo removido com sucesso!");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (activeWorkspace.flights.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum voo registrado neste plano ainda
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Origem</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Companhia</TableHead>
            <TableHead className="text-right">Milhas</TableHead>
            <TableHead className="text-right">Preço</TableHead>
            <TableHead className="text-right">Taxas</TableHead>
            <TableHead>Link</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeWorkspace.flights.map((flight) => {
            return (
              <TableRow key={flight.id}>
                <TableCell>{flight.origin}</TableCell>
                <TableCell>{flight.destination}</TableCell>
                <TableCell>{formatDate(flight.date)}</TableCell>
                <TableCell>{flight.airline}</TableCell>
                <TableCell className="text-right">
                  {flight.useDirectPrice ? "-" : flight.miles.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">{flight.price}</TableCell>
                <TableCell className="text-right">
                  {flight.taxes || "-"}
                </TableCell>
                <TableCell>
                  <a
                    href={flight.ticketLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(flight.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(flight.id)}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
          {/* Summary Row */}
          <TableRow className="font-medium">
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">
              {activeWorkspace.flights
                .reduce((sum, flight) => sum + flight.miles, 0)
                .toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              {activeWorkspace.flights
                .reduce((sum, flight) => {
                  const value = parseFloat(
                    flight.price.replace(/[^\d,]/g, "").replace(",", ".")
                  );
                  return sum + value;
                }, 0)
                .toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}{" "}
              + Taxas
            </TableCell>
            <TableCell colSpan={2}></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
