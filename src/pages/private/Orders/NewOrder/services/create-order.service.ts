import { ApiService } from "../../../../../config/api/api";

interface CreateOrderType {
    "patientName": string,
    clientId: number,
    "message": string,
    observations?: string | null
    productIds: Array<{ productId: number, amount: number }>
    serviceIds: Array<{ serviceId: number, amount: number }>
}

export interface OrderReturnType {
    "id": number,
    "patientName": string,
    "doctorName": string,
    "doctorCellphone": string,
    "message": string,
    "finished": boolean,
    "finishedAt": Date | null,
    "productionStage": []
}

export const createOrder = async (data: CreateOrderType): Promise<OrderReturnType | null> => {
    const api = new ApiService();

    return await api.RequestData("POST", "/orders", data) as Promise<OrderReturnType | null>;
};

interface EditOrderType extends CreateOrderType {
    orderId: string
}

export const editOrder = async (data: EditOrderType): Promise<OrderReturnType | null> => {
    const api = new ApiService();

    return await api.RequestData("PATCH", "/edit-order", data) as Promise<OrderReturnType | null>;
};