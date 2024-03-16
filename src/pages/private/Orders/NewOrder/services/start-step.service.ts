import { ApiService } from "../../../../../config/api/api";

interface StartOrderType {
    stageId: number
}

export const StartOrder = async ({ stageId }: StartOrderType): Promise<any> => {
    const api = new ApiService();

    return await api.RequestData("POST", "/start-stage", { stageId });
};

