export enum UserRoles {
    Root = 'ROOT',
    Ceo = 'CEO',
    ScreeningAdministration = 'Administração de triagem',
    Administration = 'ADMINISTRATION',
    Manager = 'MANAGER',
    Plaster = 'PLASTER',
    Digital = 'DIGITAL',
    Milling = 'MILLING',
    Finishing = 'FINISHING'
}

export type UserType = {
    CPF: string,
    firstLogin: boolean,
    id: number
    name: string,
    password: string,
    role: UserRoles
}