import { UserRoles } from "../../../../../types/user";
import { translateRole } from "../../../../../utils";

export const header = [
    "Id",
    "Data",
    "Cliente",
    "Paciente",
    "Valor",
    "Status",
    "Ações",
];


interface GetStatusProps {
    delivered: boolean;
    deliveredAt: Date | string | null;
    finished: boolean;
    finishedAt: Date | string | null;
    stages: Array<{
        finished: boolean;
        finishedAt: string;
        id: number;
        isReadjustment?: boolean | null;
        orderId: number;
        professionalId: number;
        reopened: boolean;
        reopenedAt?: string | null;
        role: string;
        started: boolean;
        time: string;
    }>;
}

export const getStatus = ({
    delivered,
    deliveredAt,
    finished,
    finishedAt,
    stages,
}: GetStatusProps): { text: string; color: string } => {
    const finishedStages = stages?.filter((stage) => stage.finished);
    const finishedAllStages = finishedStages?.length === stages?.length;
    const startedStage = stages.find((stage) => stage.started);

    const finish = Boolean(finished) || Boolean(finishedAt);
    const delivery = Boolean(delivered) || Boolean(deliveredAt);

    if (!stages?.length) {
        return {
            text: "Cadastrar etapas",
            color: "gray",
        };
    }

    if (startedStage) {
        return {
            text: `Setor ${translateRole(startedStage?.role as UserRoles)}`,
            color: "orange",
        };
    }

    if (!finishedAllStages && !finish && !delivery && !startedStage) {
        return {
            text: "Pedido em andamento",
            color: "blue",
        };
    }

    if (finishedAllStages && !finish && !delivery) {
        return {
            text: "Liberar para financeiro",
            color: "green",
        };
    }

    if (finish && !delivery) {
        return {
            text: "Aguardando pagamento",
            color: "yellow",
        };
    }

    if (finish && delivery) {
        return {
            text: "Finalizado",
            color: "green",
        };
    }

    return {
        text: "-",
        color: "gray",
    };
};