import { ApiService } from "../../../config/api/api";

export const getProductionLineAndRanking = async (): Promise<any> => {
    const api = new ApiService();

    return await api.RequestData("GET", `/ranking`, {});
};

export const getProductionLine = async (): Promise<any> => {
    const api = new ApiService();

    return await api.RequestData("GET", `/production-line`, {});
};

export const digitalRanking = async (): Promise<any> => {
    const api = new ApiService();

    return await api.RequestData("GET", `/ranking/digital`, {});
};


export const plasterRanking = async (): Promise<any> => {
    const api = new ApiService();

    return await api.RequestData("GET", `/ranking/plaster`, {});
};


export const millingRanking = async (): Promise<any> => {
    const api = new ApiService();

    return await api.RequestData("GET", `/ranking/milling`, {});
};

export const finishingRanking = async (): Promise<any> => {
    const api = new ApiService();

    return await api.RequestData("GET", `/ranking/finishing`, {});
};

export const readjustmentRanking = async (): Promise<any> => {
    const api = new ApiService();

    return await api.RequestData("GET", `/ranking/readjustment`, {});
};