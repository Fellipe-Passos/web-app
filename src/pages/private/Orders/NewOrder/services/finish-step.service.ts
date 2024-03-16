import { ApiService } from "../../../../../config/api/api";

interface StartOrderType {
    stageId: number
}

export const FinishStep = async ({ stageId }: StartOrderType): Promise<any> => {
    const api = new ApiService();

    return await api.RequestData("POST", "/finish-stage", { stageId });
};

