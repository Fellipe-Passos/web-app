import { ApiService } from "../../../../config/api/api";
import { UserRoles } from "../../../../types/user";
import { getUserRole } from "../../../../utils/userToken";


interface User {
    id: number;
    name: string;
    CPF: string;
    role: string;
    firstLogin: boolean;
}

export async function listUsers(): Promise<User[] | null | undefined> {
    const api = new ApiService();

    const userRole = getUserRole()

    return await api.RequestData("GET", `/users-by-userRole?userRole=${userRole}`, {}) as Promise<User[] | null | undefined>;
}


export function translateRole(role?: UserRoles): string {
    if (!role) return '-'

    if (role === UserRoles.Administration) {
        return "Administração"
    }

    if (role === UserRoles.Digital) {
        return "Digital"
    }

    if (role === UserRoles.Finishing) {
        return "Acabamento"
    }

    if (role === UserRoles.Milling) {
        return 'Fresagem'
    }

    if (role === UserRoles.Plaster) {
        return 'Gesso'
    }

    if (role === UserRoles.Root) {
        return 'Root'
    }

    if (role === UserRoles.Ceo) {
        return 'CEO'
    }

    if (role === UserRoles.Manager) {
        return 'Gerente'
    }

    if (role === UserRoles.ScreeningAdministration) {
        return "Administração de triagem"
    }

    return '-'
}