import { ApiService } from "../../../../../config/api/api";

interface AddPayrollType {
    paymentDay: number
    userId: number
}

export const AddPayroll = async (data: AddPayrollType): Promise<any> => {
    const api = new ApiService();

    return await api.RequestData("POST", "/payroll", data);
};

