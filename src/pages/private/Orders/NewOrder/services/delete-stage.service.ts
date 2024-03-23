import { ApiService } from "../../../../../config/api/api";

export const DeleteStage = async (stageId: number) => {
    const api = new ApiService();

    return await api.RequestData("DELETE", `/delete-stage/${stageId}`, {});
};