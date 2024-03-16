import { ApiService } from "../../../../config/api/api";


interface ProductType {
    name: string,
    price: string,
    commissionedItem: boolean
}

export const createService = async (data: ProductType) => {
    const api = new ApiService();

    return await api.RequestData("POST", "/service", data);
};


interface ProductTypeUpdate {
    serviceId: string
    name: string,
    price: string,
    commissionedItem: boolean
}

export const updateService = async (data: ProductTypeUpdate) => {
    const api = new ApiService();

    return await api.RequestData("PATCH", "/service", data);
};

export const getService = async (serviceId: string) => {
    const api = new ApiService();

    return await api.RequestData("GET", `/service/${serviceId}`, {});
};