import { ApiService } from "../../../../../config/api/api";

interface ListClientsReturnType {
    id: number,
    name: string
    phone: string
}

export const listClients = async (): Promise<ListClientsReturnType[] | null | undefined> => {
    const api = new ApiService();

    return await api.RequestData("GET", "/list-clients", {}) as Promise<ListClientsReturnType[] | null | undefined>;
};

export const getClientsToSelect = (clients: ListClientsReturnType[] | null | undefined): Array<{ label: string, value: string }> => {
    if (!clients) return []

    const formattedClients = clients?.map((client) => ({
        label: client?.name ?? '',
        value: client?.id?.toString() ?? ''
    }))

    return formattedClients
}