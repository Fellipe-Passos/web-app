import { ApiService } from "../../../../config/api/api";


interface GetLogsProps {
    limit?: number
    offset?: number
    type?: 'EXTERNAL' | 'INTERNAL'
}

export const getLogs = async (data: GetLogsProps) => {
    const api = new ApiService();

    return await api.RequestData("POST", `/logs-dashboard`, data) as Promise<{ totalCount: number, logs: any[] }>;
};

interface ResendMessageProps {
    destinationNumber: number, message: string
}


export const resendMessage = async ({ destinationNumber, message }: ResendMessageProps) => {
    const api = new ApiService();

    return await api.RequestData("POST", `/whatsapp-send-message`, { destinationNumber, message, INSTANCE_KEY: import.meta.env.VITE_WHATSAPP_API_INSTANCE_KEY }) as any[];
};