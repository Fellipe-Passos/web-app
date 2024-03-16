import { ApiService } from "../../../config/api/api";

interface UserType {
    login: string;
    password: string;
    confirmPassword: string
}

export const createPassword = async ({ login, ...rest }: UserType) => {
    const api = new ApiService();

    return await api.RequestData("POST", `/user-password/${login}`, { rest });
};
