import { ApiService } from "../../../../config/api/api";

interface ClientType {
    name: string,
    phone: string,
}

export const createClient = async (data: ClientType) => {
    const api = new ApiService();

    return await api.RequestData("POST", "/clients", data);
};

export const updateClient = async (data: ClientType) => {
    const api = new ApiService();

    return await api.RequestData("PATCH", "/clients", data);
};


export const getClient = async (clientId: string) => {
    const api = new ApiService();

    return await api.RequestData("GET", `/get-client/${clientId}`, {});
};

interface ZipResult {
    cep: string
    logradouro: string
    complemento: string
    bairro: string
    localidade: string
    uf: string
    ibge: string
    gia: string
    ddd: string
    siafi: string
    erro?: boolean
}

export async function getCitiesByState(state: string): Promise<Array<{ nome: string }>> {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`);
    return response.json();
}

export async function getInfosByZip(zip: string): Promise<ZipResult> {
    const response = await fetch(`https://viacep.com.br/ws/${zip}/json`);
    return response.json();
}
