import { ApiService } from "../../../../../config/api/api";

export const getPayments = async (orderId: number): Promise<{ data: any[] }> => {
    const api = new ApiService();

    return await api.RequestData("GET", `/asaas/order-collections/${orderId}`, {}) as Promise<{ data: any[] }>;
};
