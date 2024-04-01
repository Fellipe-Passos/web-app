import { ApiService } from "../../../../../config/api/api";
import { InventoryEnum } from "../../../../../types/inventory";

// interface ListMaterialsReturnType {
//     id: number,
//     name: string
//     price: string
//     brand: string
// }


export const listMaterials = async (clientId?: number): Promise<any[]> => {
    const api = new ApiService();

    return await api.RequestData("GET", !clientId ? `/list-product/${InventoryEnum.Inputs}` : `/list-product/${InventoryEnum.Inputs}/${clientId}`, {}) as Promise<any[]>;
};

export const getMaterialsToSelect = (materials: any[] | undefined): Array<{ group: string, items: Array<{ label: string, value: string }> }> => {
    if (!materials) return []

    const formattedMaterials = materials?.map((material) => ({
        group: material?.category,
        items: material?.products?.map((product: any) => ({
            label: product?.name ?? '',
            value: product?.id?.toString() ?? ''
        }))
    }))

    return formattedMaterials
}