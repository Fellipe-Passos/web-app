import { ApiService } from "../../../../config/api/api";


interface ProductType {
    name: string,
    price: string,
}

export const createProduct = async (data: ProductType) => {
    const api = new ApiService();

    return await api.RequestData("POST", "/product", data);
};


interface ProductTypeUpdate {
    name: string,
    price: string,
    productId: string,
    brand: string
}

export enum InventoryEnum {
    Inputs = 'INPUTS',
    RawMaterials = 'RAW_MATERIALS',
    Clients = 'CUSTOMERS',
    NonDental = 'NON_DENTAL'
}

export const updateProduct = async (data: ProductTypeUpdate) => {
    const api = new ApiService();

    return await api.RequestData("PATCH", "/product", data);
};

export const getProduct = async (productId: string) => {
    const api = new ApiService();

    return await api.RequestData("GET", `/get-product/${productId}`, {});
};


export const inventoryToSelect = (): Array<{ value: string, label: string }> => {
    return [
        {
            label: 'Insumos',
            value: InventoryEnum.Inputs
        },
        {
            label: 'Matérias-prima',
            value: InventoryEnum.RawMaterials
        },
        {
            label: 'Individuais (clientes)',
            value: InventoryEnum.Clients
        },
        {
            label: 'Produtos não-dentais',
            value: InventoryEnum.NonDental
        },
    ]
}