import { ApiService } from "../../../config/api/api";
import { User } from "../Orders/NewOrder/services/users.service";
import { InventoryEnum } from "../Products/AddProduct/index.service";


export const getUsers = async (): Promise<User[] | null> => {
    const api = new ApiService();

    return await api.RequestData("GET", "/users", {}) as Promise<User[] | null>;
};

interface ListMaterialsReturnType {
    id: number,
    name: string
    price: string
    brand: string
    table: InventoryEnum
}

export const listMaterials = async (): Promise<ListMaterialsReturnType[] | null | undefined> => {
    const api = new ApiService();

    return await api.RequestData("GET", `/list-product`, {}) as Promise<ListMaterialsReturnType[] | null | undefined>;
};

export const getMaterialsToSelect = (materials: ListMaterialsReturnType[] | null | undefined): Array<{ label: string, value: string }> => {
    if (!materials) return []

    const formattedMaterials = materials?.map((material) => ({
        label: material?.name ?? '',
        value: material?.id?.toString() ?? ''
    }))

    return formattedMaterials
}