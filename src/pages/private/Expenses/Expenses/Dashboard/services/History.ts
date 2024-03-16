import { ApiService } from "../../../../../../config/api/api";

interface GetHistoryProps {
    expenseId: number
}

export const GetHistory = async ({ expenseId }: GetHistoryProps): Promise<any> => {
    const api = new ApiService();

    return await api.RequestData("POST", "/expense/history", { expenseId });
};

