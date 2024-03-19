import { ApiService } from "../../../../config/api/api";
import { OrderReturnType } from "../../Orders/NewOrder/services/create-order.service";


interface TransactionsByCustomerReturnType {
    id: number
    name: string,
    negativeBalance: number
}

export const getTransactionsByCustomer = async (): Promise<TransactionsByCustomerReturnType[] | null | undefined> => {
    const api = new ApiService();

    return await api.RequestData("GET", "/transactions/customer", {}) as Promise<TransactionsByCustomerReturnType[] | null | undefined>;
};

export enum TransactionsEnum {
    CREDIT = "CREDIT",
    DEBT = "DEBT",
}

interface ReportTransactionProps {
    manualInput?: boolean
    value: number
    description: string
    orderId?: number
    clientId: number
    type: TransactionsEnum
}

export const reportTransaction = async (data: ReportTransactionProps) => {
    const api = new ApiService();

    return await api.RequestData("POST", "/transaction", data) as Promise<TransactionsByCustomerReturnType[] | null | undefined>;
};


interface TransactionsCustomerProps {
    "id": number,
    "manualInput": boolean,
    "value": number,
    "description": string,
    "createdAt": string | Date,
    "orderId": null,
    "clientId": number,
    "type": TransactionsEnum
    "discount": number | null,
    "finalValue": number | null,
    "userId": number | null,
    "user": null | {
        name: string
    }
}

export const getTransactionsCustomer = async (clientId: number | null | undefined): Promise<TransactionsCustomerProps[] | null | undefined> => {
    const api = new ApiService();

    return await api.RequestData("GET", `/transactions/customer/${clientId}`, {}) as Promise<TransactionsCustomerProps[] | null | undefined>;
};

export const getOrdersToSelect = (orders?: any[]) => {
    if (!orders?.length) return [];

    const obj = orders?.map((order: any) => ({
        label: `${order?.id} - ${order?.client?.name}, Pac: ${order?.patientName}`,
        value: order?.id?.toString()
    }))

    return obj
}