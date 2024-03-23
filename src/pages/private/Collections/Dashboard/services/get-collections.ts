import { ApiService } from "../../../../../config/api/api";

export const getCollections = async ({ limit, offset }: { limit: number, offset: number }): Promise<{ data: any[], totalCount: number }> => {
    const api = new ApiService();

    return await api.RequestData("GET", `/asaas/collections?offset=${offset}&limit=${limit}`, {}) as Promise<{ data: any[], totalCount: number }>;
};
