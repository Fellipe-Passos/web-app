import { ApiService } from "../../../../../config/api/api";

interface StartOrderType {
    orderId: number
}

export const SendToFinancial = async ({ orderId }: StartOrderType): Promise<any> => {
    const api = new ApiService();

    return await api.RequestData("POST", `/order-to-financial/${orderId}`, {});
};

