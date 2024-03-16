import { ApiService } from "../../../../../config/api/api";

interface ListServicesReturnType {
    id: number,
    name: string
    price: string
}


export const listServices = async (): Promise<ListServicesReturnType[] | null | undefined> => {
    const api = new ApiService();

    return await api.RequestData("GET", "/list-services", {}) as Promise<ListServicesReturnType[] | null | undefined>;
};

export const getServicesToSelect = (materials: ListServicesReturnType[] | null | undefined): Array<{ label: string, value: string }> => {
    if (!materials) return []

    const formattedMaterials = materials?.map((material) => ({
        label: material?.name ?? '',
        value: material?.id?.toString() ?? ''
    }))

    return formattedMaterials
}
