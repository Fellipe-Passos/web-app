import { ApiService } from "../../../../../../config/api/api";
import { ExpenseEnum } from "../../../../../../types/expenses";

interface AddExpenseType {
    dueDay: number,
    dueMonths: string[],
    type: ExpenseEnum,
    value: number,
}

export const AddExpense = async (data: AddExpenseType): Promise<any> => {
    const api = new ApiService();

    return await api.RequestData("POST", "/expense", data);
};

