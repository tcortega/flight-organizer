import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
    useDirectPrice: boolean;
    directPrice?: string;
    taxes?: string;
}

export function FlightForm({ onSuccess, editingFlight }: FlightFormProps) {
    const { airlines } = useAirlineStore();
    const { activeWorkspaceId, addFlight, updateFlight } = useWorkspaceStore();

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormValues>({
        defaultValues: editingFlight
            ? {
                origin: editingFlight.origin,
                destination: editingFlight.destination,
                date: new Date(editingFlight.date).toISOString().slice(0, 16),
                airline: editingFlight.airline,
                miles: editingFlight.miles.toString(),
                ticketLink: editingFlight.ticketLink,
                useDirectPrice: editingFlight.useDirectPrice,
                directPrice: editingFlight.useDirectPrice ? editingFlight.price : undefined,
                taxes: editingFlight.taxes
            }
            : {
                date: new Date().toISOString().slice(0, 16),
                useDirectPrice: false
            }
    });

    const watchMiles = watch("miles");
    const watchAirline = watch("airline");
    const watchUseDirectPrice = watch("useDirectPrice");
    const watchDirectPrice = watch("directPrice");

    const calculatePrice = (miles: number, airlineName: string): string => {
        const airline = airlines.find(a => a.name === airlineName);
        if (airline && miles) {
            const priceInReais = (miles / 1000) * airline.pricePerThousandMiles;
            return priceInReais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        return "R$ 0,00";
    };

    const formatCurrency = (value: string) => {
        // Remove any non-numeric characters
        const numericValue = value.replace(/\D/g, '');
        if (!numericValue) return '';
        
        // Convert to float (divide by 100 to handle cents)
        const floatValue = parseInt(numericValue) / 100;
        return floatValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const parseCurrencyToNumber = (value?: string) => {
        if (!value) return 0;
        // Remove currency symbol, dots and convert comma to dot for proper float parsing
        return parseFloat(value.replace(/[R$\s.]/g, '').replace(',', '.'));
    };

    const estimatedPrice = watchUseDirectPrice 
        ? watchDirectPrice 
        : calculatePrice(Number(watchMiles) || 0, watchAirline);

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
            miles: data.useDirectPrice ? 0 : Number(data.miles),
            price: data.useDirectPrice ? data.directPrice! : calculatePrice(Number(data.miles), data.airline),
            ticketLink: data.ticketLink,
            useDirectPrice: data.useDirectPrice,
            taxes: data.taxes || undefined
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
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Usar preço direto</Label>
                    <p className="text-sm text-muted-foreground">
                        Insira o preço diretamente ao invés de calcular por milhas
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="useDirectPrice"
                        checked={watchUseDirectPrice}
                        onCheckedChange={(checked) => setValue("useDirectPrice", checked)}
                        className="data-[state=checked]:bg-primary"
                    />
                </div>
            </div>

            {watchUseDirectPrice ? (
                <div className="space-y-2">
                    <Label htmlFor="directPrice">Preço</Label>
                    <Input
                        id="directPrice"
                        {...register("directPrice", {
                            required: "Preço é obrigatório quando selecionado",
                            validate: {
                                validPrice: (value) => {
                                    const price = parseCurrencyToNumber(value);
                                    return price > 0 || "Preço deve ser maior que zero";
                                }
                            }
                        })}
                        placeholder="R$ 0,00"
                        onChange={(e) => {
                            const formatted = formatCurrency(e.target.value);
                            setValue("directPrice", formatted);
                        }}
                    />
                    {errors.directPrice && (
                        <span className="text-sm text-destructive">{errors.directPrice.message}</span>
                    )}
                </div>
            ) : (
                <div className="space-y-2">
                    <Label htmlFor="miles">Milhas</Label>
                    <Input
                        id="miles"
                        type="number"
                        {...register("miles", {
                            required: "Milhas é obrigatório quando selecionado",
                            min: { value: 1, message: "Milhas deve ser maior que zero" },
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
            )}

            <div className="space-y-2">
                <Label htmlFor="taxes">Taxas (opcional)</Label>
                <Input
                    id="taxes"
                    {...register("taxes", {
                        validate: {
                            validTax: (value) => {
                                if (!value) return true; // Optional field
                                const tax = parseCurrencyToNumber(value);
                                return tax >= 0 || "Taxas não podem ser negativas";
                            }
                        }
                    })}
                    placeholder="R$ 0,00"
                    onChange={(e) => {
                        const formatted = formatCurrency(e.target.value);
                        setValue("taxes", formatted);
                    }}
                />
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

            <div className="flex gap-2 justify-end">
                <Button type="submit">
                    {editingFlight ? "Atualizar" : "Adicionar"} Voo
                </Button>
            </div>
        </form>
    );
}