import { ApiService } from "../../../../../../config/api/api";

interface PayExpenseType {
    expenseId: number
}

export const PayExpense = async ({ expenseId }: PayExpenseType): Promise<any> => {
    const api = new ApiService();

    return await api.RequestData("POST", "/pay-expense", { expenseId });
};

interface PayEmployeeType {
    payrollId: number
    salaryAmount: number
    commissionsAmount?: number | null
    userId: number
}

export const PayEmployee = async (data: PayEmployeeType): Promise<any> => {
    const api = new ApiService();

    return await api.RequestData("POST", "/pay-payroll", data);
};
