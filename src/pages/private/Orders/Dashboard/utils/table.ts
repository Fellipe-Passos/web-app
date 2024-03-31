import { UserRoles } from "../../../../../types/user";
import { translateRole } from "../../../../../utils";

export const header = [
    "Id",
    "Data",
    "Atraso",
    "Cliente",
    "Paciente",
    "Valor",
    "Status",
    "Ações",
];


interface GetStatusProps {
    underAnalysis: boolean;
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
    underAnalysis
}: GetStatusProps): { text: string; color: string } => {
    const finishedStages = stages?.filter((stage) => stage.finished);
    const finishedAllStages = finishedStages?.length === stages?.length;
    const startedStage = stages.find((stage) => stage.started);

    const finish = Boolean(finished) || Boolean(finishedAt);
    const delivery = Boolean(delivered) || Boolean(deliveredAt);

    if (underAnalysis) {
        return {
            text: 'Em análise',
            color: 'orange'
        }
    }

    if (!stages?.length) {
        return {
            text: "Sem etapas",
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
            text: "Etapas finalizadas",
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
            text: "Pago",
            color: "green",
        };
    }

    return {
        text: "-",
        color: "gray",
    };
};