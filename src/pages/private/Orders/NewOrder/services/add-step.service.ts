import { ApiService } from "../../../../../config/api/api";
import { UserRoles } from "../../../../../types/user";


interface AddStepsType {
    stage: {
        orderId: string,
        role: UserRoles,
        professionalId: number,
        time: string
    },
}

export const AddSteps = async ({ stage }: AddStepsType): Promise<any> => {
    const api = new ApiService();

    return await api.RequestData("POST", "/create-one-stage", { stage });
};

