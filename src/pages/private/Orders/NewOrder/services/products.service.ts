import { ApiService } from "../../../../../config/api/api";
import { InventoryEnum } from "../../../../../types/inventory";

interface ListMaterialsReturnType {
    id: number,
    name: string
    price: string
    brand: string
}

export const listMaterials = async (): Promise<ListMaterialsReturnType[] | null | undefined> => {
    const api = new ApiService();

    return await api.RequestData("GET", `/list-product/${InventoryEnum.Inputs}`, {}) as Promise<ListMaterialsReturnType[] | null | undefined>;
};

export const getMaterialsToSelect = (materials: ListMaterialsReturnType[] | null | undefined): Array<{ label: string, value: string }> => {
    if (!materials) return []

    const formattedMaterials = materials?.map((material) => ({
        label: material?.name ?? '',
        value: material?.id?.toString() ?? ''
    }))

    return formattedMaterials
}