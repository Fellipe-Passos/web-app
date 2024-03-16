import { ApiService } from "../../../config/api/api";

export const getProductionLineAndRanking = async (): Promise<any> => {
    const api = new ApiService();

    return await api.RequestData("GET", `/ranking`, {});
};

export const getProductionLine = async (): Promise<any> => {
    const api = new ApiService();

    return await api.RequestData("GET", `/production-line`, {});
};