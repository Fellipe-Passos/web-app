import { ApiService } from "../../../../../config/api/api";
import { UserRoles } from "../../../../../types/user";

export const getRolesToSelect = (): Array<{ label: string, value: string }> => {
    const allowedRoles: Array<{ label: string, value: string }> = [
        { label: "Acabamento", value: UserRoles.Finishing },
        { label: "Digital", value: UserRoles.Digital },
        { label: "Fresagem", value: UserRoles.Milling },
        { label: "Gesso", value: UserRoles.Plaster },
    ]

    return allowedRoles
}

interface GetUserByRoleType {
    role: UserRoles
}

export interface User {
    id: number;
    name: string;
    CPF: string;
    role: string;
    firstLogin: boolean;
}

export const getUserByRole = async (data: GetUserByRoleType): Promise<User[] | null> => {
    const api = new ApiService();

    return await api.RequestData("POST", "/users-by-role", data) as Promise<User[] | null>;
};

export const getUsersToSelect = (users: User[]): Array<{ label: string, value: string }> => {
    if (!users) return []

    const usersToSelect = users?.map((user: User) => ({
        label: user?.name ?? '',
        value: user?.id?.toString() ?? ''
    }))

    return usersToSelect
}