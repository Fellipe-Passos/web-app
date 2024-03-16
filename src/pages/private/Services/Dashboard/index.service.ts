import { ApiService } from "../../../../config/api/api";


interface ProductsReturnType {
    id: number
    name: string,
    price: string,
    commissionedItem: boolean
}

export const listServices = async (): Promise<ProductsReturnType[] | null | undefined> => {
    const api = new ApiService();

    return await api.RequestData("GET", "/list-services", {}) as Promise<ProductsReturnType[] | null | undefined>;
};
