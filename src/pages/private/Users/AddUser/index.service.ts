import { ApiService } from "../../../../config/api/api"
import { UserRoles } from "../../../../types/user"
import { getUserRole } from "../../../../utils/userToken"

export const getRolesToSelect = (): Array<{ label: string, value: string }> => {
    const userRole = getUserRole()

    if (userRole === UserRoles.Root) {
        const allowedRoles: Array<{ label: string, value: string }> = [
            { label: 'Administração de triagem', value: UserRoles.ScreeningAdministration },
            { label: "Acabamento", value: UserRoles.Finishing },
            { label: "Administração", value: UserRoles.Administration },
            { label: "Gerente", value: UserRoles.Manager },
            { label: "Digital", value: UserRoles.Digital },
            { label: "Fresagem", value: UserRoles.Milling },
            { label: "Gesso", value: UserRoles.Plaster },
            { label: 'Root', value: UserRoles.Root },
            { label: 'CEO', value: UserRoles.Ceo },
        ]

        return allowedRoles
    }

    if (userRole === UserRoles.Ceo) {
        const allowedRoles: Array<{ label: string, value: string }> = [
            { label: 'Administração de triagem', value: UserRoles.ScreeningAdministration },
            { label: "Gerente", value: UserRoles.Manager },
            { label: "Administração", value: UserRoles.Administration },
            { label: "Acabamento", value: UserRoles.Finishing },
            { label: "Digital", value: UserRoles.Digital },
            { label: "Fresagem", value: UserRoles.Milling },
            { label: "Gesso", value: UserRoles.Plaster },
            { label: 'CEO', value: UserRoles.Ceo },
        ]

        return allowedRoles
    }

    if (userRole === UserRoles.Manager) {
        const allowedRoles: Array<{ label: string, value: string }> = [
            { label: 'Administração de triagem', value: UserRoles.ScreeningAdministration },
            { label: "Administração", value: UserRoles.Administration },
            { label: "Acabamento", value: UserRoles.Finishing },
            { label: "Digital", value: UserRoles.Digital },
            { label: "Fresagem", value: UserRoles.Milling },
            { label: "Gesso", value: UserRoles.Plaster },
        ]

        return allowedRoles
    }

    if (userRole === UserRoles.Administration) {
        const allowedRoles: Array<{ label: string, value: string }> = [
            { label: "Acabamento", value: UserRoles.Finishing },
            { label: "Digital", value: UserRoles.Digital },
            { label: "Fresagem", value: UserRoles.Milling },
            { label: "Gesso", value: UserRoles.Plaster },
        ]

        return allowedRoles
    }

    return []
}

interface UserType {
    name: string,
    CPF: string,
    role: UserRoles
}

export const createUser = async (data: UserType) => {
    const api = new ApiService();

    return await api.RequestData("POST", "/users", data);
};
