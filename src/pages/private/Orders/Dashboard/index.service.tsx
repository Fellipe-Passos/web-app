import { notifications } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
import { UserRoles } from "../../../../types/user";
import { ApiService } from "../../../../config/api/api";

type Stage = {
  orderId?: number | string;
  role: UserRoles | string;
  professionalId: number | string;
  time: Date | string;
};

export interface CreateProductionStageType {
  stages: Stage[];
  INSTANCE_KEY: string;
}

interface DeleteOrderType {
  orderId: string;
}

export const DeleteOrder = async ({
  orderId,
}: DeleteOrderType): Promise<any> => {
  const api = new ApiService();

  return await api.RequestData("DELETE", `/order/${orderId}`, {});
};

interface ProductionStage {
  id: number;
  role: string;
  time: string;
  professionalId: number;
  orderId: number;
  finished: boolean;
  finishedAt: string | null;
}

export interface Order {
  orderId: string;
  doctor: string;
  patient: string;
  product: string;
  currentRole: string;
  nextRole: string;
  price: string;
}

type Client = {
  id: number;
  name: string;
  phone: string;
};

type Material = {
  id: number;
  name: string;
  price: string;
};

export interface GetOrderReturnType {
  id: string;
  patientName: string;
  clientId: number;
  materialId: number;
  message: string;
  amount: number;
  price: number;
  finished: boolean;
  finishedAt: string | null;
  productionStage: ProductionStage[];
  client: Client;
  material: Material;
}

export async function listOrdersInProgress(
  type?: "ALL" | "IN_PROGRESS" | "WAITING_STEPS" | "FOR_DELIVERY" | "FINALIZED",
  search?: string
): Promise<any[]> {
  const api = new ApiService();

  return (await api.RequestData(
    "GET",
    `/orders-in-progress?type=${type}&search=${search}`,
    {}
  )) as Promise<any[]>;
}

export const getOrder = async (orderId: string): Promise<any> => {
  const api = new ApiService();

  return await api.RequestData("GET", `/order/${orderId}`, {});
};

interface NextStepType {
  orderId: string;
}

export const nextStep = async ({ orderId }: NextStepType) => {
  const api = new ApiService();

  return await api.RequestData("POST", `/order-next-step/${orderId}`, {
    INSTANCE_KEY: import.meta.env.VITE_WHATSAPP_API_INSTANCE_KEY,
  });
};

export const nextStepSuccess = (): void => {
  notifications.show({
    title: "Etapa avançada",
    message: "A ação de avançar etapa foi concluída com sucesso!",
    color: "green",
    icon: <Check />,
    styles: (theme) => ({
      root: {
        backgroundColor: theme.colors.green[0],
        borderColor: theme.colors.green[6],

        "&::before": { backgroundColor: theme.white },
      },

      title: { color: theme.colors.green[6] },
      description: { color: theme.colors.green[6] },
      closeButton: {
        color: theme.colors.green[6],
        "&:hover": { backgroundColor: theme.colors.green[1] },
      },
    }),
  });
};

export const nextStepError = (err: any): void => {
  notifications.show({
    title: "Falha ao cadastrar usuário",
    message: err?.response?.data ?? "",
    color: "red",
    icon: <X />,
    styles: (theme) => ({
      root: {
        backgroundColor: theme.colors.red[0],
        borderColor: theme.colors.red[6],

        "&::before": { backgroundColor: theme.white },
      },

      title: { color: theme.colors.red[6] },
      description: { color: theme.colors.red[6] },
      closeButton: {
        color: theme.colors.red[6],
        "&:hover": { backgroundColor: theme.colors.red[1] },
      },
    }),
  });
};

interface AddStagesType extends Pick<CreateProductionStageType, "stages"> {
  orderId: string;
}

export const addStages = async (data: AddStagesType) => {
  const api = new ApiService();

  return await api.RequestData("POST", `/add-stages`, data);
};

export const addStagesSuccess = () => {
  notifications.show({
    title: "Etapas adicionadas",
    message: "A ação de adicionar etapas foi concluída com sucesso!",
    color: "green",
    icon: <Check />,
    styles: (theme) => ({
      root: {
        backgroundColor: theme.colors.green[0],
        borderColor: theme.colors.green[6],

        "&::before": { backgroundColor: theme.white },
      },

      title: { color: theme.colors.green[6] },
      description: { color: theme.colors.green[6] },
      closeButton: {
        color: theme.colors.green[6],
        "&:hover": { backgroundColor: theme.colors.green[1] },
      },
    }),
  });
};

export const addStagesError = (err: any): void => {
  notifications.show({
    title: "Falha ao adicionar etapas",
    message: err?.response?.data ?? "",
    color: "red",
    icon: <X />,
    styles: (theme) => ({
      root: {
        backgroundColor: theme.colors.red[0],
        borderColor: theme.colors.red[6],

        "&::before": { backgroundColor: theme.white },
      },

      title: { color: theme.colors.red[6] },
      description: { color: theme.colors.red[6] },
      closeButton: {
        color: theme.colors.red[6],
        "&:hover": { backgroundColor: theme.colors.red[1] },
      },
    }),
  });
};

interface StartOrderType {
  orderId: number;
}

export const FinishOrder = async ({
  orderId,
}: StartOrderType): Promise<any> => {
  const api = new ApiService();

  return await api.RequestData("POST", "/finish-order", { orderId });
};

export const findOrder = async ({
  orderId,
}: NextStepType): Promise<Order[] | null | undefined> => {
  const api = new ApiService();

  return (await api.RequestData(
    "GET",
    `/find-order/${orderId}`,
    {}
  )) as Promise<Order[] | null | undefined>;
};
