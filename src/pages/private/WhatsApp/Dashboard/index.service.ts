import { ApiService } from "../../../../config/api/api";


export const getLogs = async () => {
    const api = new ApiService();

    return await api.RequestData("GET", `/logs`, {}) as any[];
};

interface ResendMessageProps {
    destinationNumber: number, message: string
}


export const resendMessage = async ({ destinationNumber, message }: ResendMessageProps) => {
    const api = new ApiService();

    return await api.RequestData("POST", `/whatsapp-send-message`, { destinationNumber, message, INSTANCE_KEY: import.meta.env.VITE_WHATSAPP_API_INSTANCE_KEY }) as any[];
};