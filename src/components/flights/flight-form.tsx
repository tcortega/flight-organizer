import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { useAirlineStore } from "@/stores/useAirlineStore";
import { toast } from "sonner";
import { Flight } from "@/types/flight";

interface FlightFormProps {
    onSuccess?: () => void;
    editingFlight?: Flight;
}

interface FormValues {
    origin: string;
    destination: string;
    date: string;
    airline: string;
    miles: string;
    ticketLink: string;
}

export function FlightForm({ onSuccess, editingFlight }: FlightFormProps) {
    const { airlines } = useAirlineStore();
    const { activeWorkspaceId, addFlight, updateFlight } = useWorkspaceStore();

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormValues>({
        defaultValues: editingFlight
            ? {
                origin: editingFlight.origin,
                destination: editingFlight.destination,
                date: new Date(editingFlight.date).toISOString().slice(0, 16), // Format for datetime-local
                airline: editingFlight.airline,
                miles: editingFlight.miles.toString(),
                ticketLink: editingFlight.ticketLink,
            }
            : {
                date: new Date().toISOString().slice(0, 16), // Current datetime as default
            }
    });

    const watchMiles = watch("miles");
    const watchAirline = watch("airline");

    const calculatePrice = (miles: number, airlineName: string): string => {
        const airline = airlines.find(a => a.name === airlineName);
        if (airline && miles) {
            const priceInReais = (miles / 1000) * airline.pricePerThousandMiles;
            return priceInReais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        return "R$ 0,00";
    };

    const estimatedPrice = calculatePrice(Number(watchMiles) || 0, watchAirline);

    const onSubmit = handleSubmit((data) => {
        if (!activeWorkspaceId) {
            toast.error("Selecione um plano de viagem primeiro!");
            return;
        }

        const flightData = {
            origin: data.origin,
            destination: data.destination,
            date: data.date,
            airline: data.airline,
            miles: Number(data.miles),
            price: calculatePrice(Number(data.miles), data.airline),
            ticketLink: data.ticketLink,
        };

        if (editingFlight) {
            updateFlight(activeWorkspaceId, editingFlight.id, flightData);
            toast.success("Voo atualizado com sucesso!");
        } else {
            addFlight(activeWorkspaceId, flightData);
            toast.success("Voo adicionado com sucesso!");
        }

        onSuccess?.();
    });

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="origin">Origem</Label>
                    <Input
                        id="origin"
                        {...register("origin", { required: "Origem é obrigatória" })}
                        placeholder="GRU"
                    />
                    {errors.origin && (
                        <span className="text-sm text-destructive">{errors.origin.message}</span>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="destination">Destino</Label>
                    <Input
                        id="destination"
                        {...register("destination", { required: "Destino é obrigatório" })}
                        placeholder="MCO"
                    />
                    {errors.destination && (
                        <span className="text-sm text-destructive">{errors.destination.message}</span>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="date">Data e Hora</Label>
                    <Input
                        id="date"
                        type="datetime-local"
                        {...register("date", { required: "Data é obrigatória" })}
                    />
                    {errors.date && (
                        <span className="text-sm text-destructive">{errors.date.message}</span>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="airline">Companhia Aérea</Label>
                    <Select
                        value={watchAirline}
                        onValueChange={(value) => setValue("airline", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione uma companhia" />
                        </SelectTrigger>
                        <SelectContent>
                            {airlines.map((airline) => (
                                <SelectItem key={airline.id} value={airline.name}>
                                    {airline.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.airline && (
                        <span className="text-sm text-destructive">{errors.airline.message}</span>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="miles">Milhas</Label>
                    <Input
                        id="miles"
                        type="number"
                        {...register("miles", {
                            required: "Milhas é obrigatório",
                            min: { value: 1, message: "Milhas deve ser maior que 0" },
                            pattern: {
                                value: /^\d+$/,
                                message: "Apenas números inteiros"
                            }
                        })}
                    />
                    {watchMiles && watchAirline && (
                        <p className="text-sm text-muted-foreground">
                            Valor estimado: {estimatedPrice}
                        </p>
                    )}
                    {errors.miles && (
                        <span className="text-sm text-destructive">{errors.miles.message}</span>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ticketLink">Link da Passagem</Label>
                    <Input
                        id="ticketLink"
                        type="url"
                        {...register("ticketLink", {
                            required: "Link é obrigatório",
                            pattern: {
                                value: /^https?:\/\/.+/,
                                message: "URL inválida"
                            }
                        })}
                        placeholder="https://"
                    />
                    {errors.ticketLink && (
                        <span className="text-sm text-destructive">{errors.ticketLink.message}</span>
                    )}
                </div>
            </div>

            <div className="flex gap-2 justify-end">
                <Button type="submit">
                    {editingFlight ? "Atualizar" : "Adicionar"} Voo
                </Button>
            </div>
        </form>
    );
}