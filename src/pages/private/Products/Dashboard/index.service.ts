import { ApiService } from "../../../../config/api/api";
import { InventoryEnum } from "../AddProduct/index.service";


interface ProductsReturnType {
    id: number
    name: string,
    price: string,
    brand: string,
    qtd: number
    table: InventoryEnum
}

interface ListProductsProps {
    table?: InventoryEnum
}

export const listProducts = async ({ table }: ListProductsProps): Promise<ProductsReturnType[] | null | undefined> => {
    const api = new ApiService();

    return await api.RequestData("GET", table ? `/list-product/${table}` : "/list-product", {}) as Promise<ProductsReturnType[] | null | undefined>;
};
