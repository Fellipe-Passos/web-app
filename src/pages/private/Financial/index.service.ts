import { ApiService } from "../../../config/api/api";

export async function getFinancial(
): Promise<any> {
    const api = new ApiService();

    return await api.RequestData("GET", `/financial`, {})
}
