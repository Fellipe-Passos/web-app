import { UserType } from "../types/user";

export function getUserRole() {
    const token = localStorage.getItem('@ProductionLine:user') || '{}'

    if (token) {
        const { role } = JSON?.parse(token) as UserType

        return role
    }

    return undefined
}

export function getUserFirstName() {
    const userData = JSON.parse(localStorage.getItem('@ProductionLine:user') || '') as UserType;

    if (userData && userData?.name) {
        const nameParts = userData?.name?.split(' ');

        return nameParts[0];
    }

    return 'Usuário';
}
