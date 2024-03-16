import { ApiService } from "../../../../../../config/api/api";
import { ExpenseEnum } from "../../../../../../types/expenses";


export const ListExpenses = async ({ type }: { type: ExpenseEnum }): Promise<any> => {
    const api = new ApiService();

    if (type !== ExpenseEnum.EMPLOYEES) {
        return await api.RequestData("POST", `/expenses/${type}`, {});
    }

    return await api.RequestData("POST", `/list-payrolls`, {});
};

