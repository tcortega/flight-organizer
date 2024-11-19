import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAirlineStore } from "@/stores/useAirlineStore";
import { toast } from "sonner";

interface AirlineFormProps {
    onSuccess?: () => void;
    editingAirline?: {
        id: string;
        name: string;
        pricePerThousandMiles: number;
    };
}

interface FormValues {
    name: string;
    pricePerThousandMiles: string;
}

export function AirlineForm({ onSuccess, editingAirline }: AirlineFormProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
        defaultValues: editingAirline
            ? {
                name: editingAirline.name,
                pricePerThousandMiles: editingAirline.pricePerThousandMiles.toString()
            }
            : undefined
    });

    const { addAirline, updateAirline } = useAirlineStore();

    const onSubmit = handleSubmit((data) => {
        const price = parseFloat(data.pricePerThousandMiles);

        if (editingAirline) {
            updateAirline(editingAirline.id, {
                name: data.name,
                pricePerThousandMiles: price
            });
            toast.success("Companhia aérea atualizada com sucesso!");
        } else {
            addAirline({
                name: data.name,
                pricePerThousandMiles: price
            });
            toast.success("Companhia aérea adicionada com sucesso!");
        }

        reset();
        onSuccess?.();
    });

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nome da Companhia</Label>
                <Input
                    id="name"
                    {...register("name", { required: "Nome é obrigatório" })}
                />
                {errors.name && (
                    <span className="text-sm text-destructive">{errors.name.message}</span>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="pricePerThousandMiles">Preço por Mil Milhas (R$)</Label>
                <Input
                    id="pricePerThousandMiles"
                    type="number"
                    step="0.01"
                    {...register("pricePerThousandMiles", {
                        required: "Preço é obrigatório",
                        min: { value: 0, message: "Preço deve ser maior que 0" },
                        pattern: {
                            value: /^\d*\.?\d{0,2}$/,
                            message: "Formato inválido"
                        }
                    })}
                />
                {errors.pricePerThousandMiles && (
                    <span className="text-sm text-destructive">
                        {errors.pricePerThousandMiles.message}
                    </span>
                )}
            </div>

            <Button type="submit" className="w-full">
                {editingAirline ? "Atualizar" : "Adicionar"} Companhia
            </Button>
        </form>
    );
}