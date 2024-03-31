import { ApiService } from "../../../../config/api/api";

interface Client {
    id: number;
    name: string;
    phone: string;
    asaasCustomerId?: string
    CPF: string
    orderCollection: boolean
    password?: string
}

export async function listClients(search?: string): Promise<Client[] | null | undefined> {
    const api = new ApiService();

    return await api.RequestData("GET", !search ? "/list-clients" : `/list-clients?search=${search}`, {}) as Promise<Client[] | null | undefined>;
}
