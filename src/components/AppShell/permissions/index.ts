import { Adjustments, Box, BrandWhatsapp, Briefcase, Checklist, DeviceTv, Moneybag, PigMoney, Report, ReportMoney, Tools, User, Users, ZoomMoney } from "tabler-icons-react";
import { UserRoles } from "../../../types/user";

export const navbarOptions = (userRole: UserRoles): any[] => {
    const options: any[] = []

    if ([UserRoles.Ceo]?.includes(userRole)) {
        options.push(...[
            {
                text: "Pedidos",
                URL: "/view-orders",
                icon: ReportMoney
            },
            {
                text: "Finanças",
                URL: "/financial",
                icon: PigMoney,
                child: [
                    {
                        text: "Financeiro",
                        URL: "/financial",
                        icon: Moneybag,
                    },
                    {
                        text: "Caixa",
                        URL: "/transactions",
                        icon: ReportMoney
                    },
                    {
                        text: "Cobranças",
                        URL: "/collections",
                        icon: ZoomMoney
                    },
                    {
                        text: "Despesas",
                        URL: "/expenses",
                        icon: Checklist
                    },
                ]
            },
            {
                text: "Administrativo",
                URL: "/products",
                icon: Adjustments,
                child: [
                    {
                        text: "Estoque",
                        URL: "/products",
                        icon: Box
                    },
                    {
                        text: "Serviços",
                        URL: "/services-dashboard",
                        icon: Tools
                    },
                    {
                        text: "Clientes",
                        URL: "/clients",
                        icon: Users
                    },

                    {
                        text: "Colaboradores",
                        URL: "/view-users",
                        icon: User
                    },
                ]
            },
            {
                text: "BackOffice",
                URL: "/reports",
                icon: Briefcase,
                child: [
                    {
                        text: "Relatórios",
                        URL: "/reports",
                        icon: Report
                    },
                    {
                        text: "WhatsApp",
                        URL: "/whatsapp-logs",
                        icon: BrandWhatsapp
                    },
                ]
            },
            {
                text: "TV Lab",
                URL: "/ranking",
                icon: DeviceTv
            },
        ])
    }

    if ([UserRoles?.Manager]?.includes(userRole)) {
        options.push(...[
            {
                text: "Pedidos",
                URL: "/view-orders",
                icon: ReportMoney
            },
            {
                text: "Finanças",
                URL: "/financial",
                icon: PigMoney,
                child: [
                    {
                        text: "Financeiro",
                        URL: "/financial",
                        icon: Moneybag,
                    },
                    {
                        text: "Caixa",
                        URL: "/transactions",
                        icon: ReportMoney
                    },
                    {
                        text: "Cobranças",
                        URL: "/collections",
                        icon: ZoomMoney
                    },
                    {
                        text: "Despesas",
                        URL: "/expenses",
                        icon: Checklist
                    },
                ]
            },
            {
                text: "Administrativo",
                URL: "/products",
                icon: Adjustments,
                child: [
                    {
                        text: "Estoque",
                        URL: "/products",
                        icon: Box
                    },
                    {
                        text: "Serviços",
                        URL: "/services-dashboard",
                        icon: Tools
                    },
                    {
                        text: "Clientes",
                        URL: "/clients",
                        icon: Users
                    },

                    {
                        text: "Colaboradores",
                        URL: "/view-users",
                        icon: User
                    },
                ]
            },
            {
                text: "BackOffice",
                URL: "/reports",
                icon: Briefcase,
                child: [
                    {
                        text: "Relatórios",
                        URL: "/reports",
                        icon: Report
                    },
                    {
                        text: "WhatsApp",
                        URL: "/whatsapp-logs",
                        icon: BrandWhatsapp
                    },
                ]
            },
            {
                text: "TV Lab",
                URL: "/ranking",
                icon: DeviceTv
            },
        ])
    }

    if ([UserRoles.Administration]?.includes(userRole)) {
        options.push(...[
            {
                text: "Pedidos",
                URL: "/view-orders",
                icon: ReportMoney
            },
            {
                text: "Finanças",
                URL: "/financial",
                icon: PigMoney,
                child: [
                    {
                        text: "Financeiro",
                        URL: "/financial",
                        icon: Moneybag,
                    },
                    {
                        text: "Caixa",
                        URL: "/transactions",
                        icon: ReportMoney
                    },
                    {
                        text: "Cobranças",
                        URL: "/collections",
                        icon: ZoomMoney
                    },
                    {
                        text: "Despesas",
                        URL: "/expenses",
                        icon: Checklist
                    },
                ]
            },
            {
                text: "Administrativo",
                URL: "/products",
                icon: Adjustments,
                child: [
                    {
                        text: "Estoque",
                        URL: "/products",
                        icon: Box
                    },
                    {
                        text: "Serviços",
                        URL: "/services-dashboard",
                        icon: Tools
                    },
                    {
                        text: "Clientes",
                        URL: "/clients",
                        icon: Users
                    },

                    {
                        text: "Colaboradores",
                        URL: "/view-users",
                        icon: User
                    },
                ]
            },
            {
                text: "BackOffice",
                URL: "/reports",
                icon: Briefcase,
                child: [
                    {
                        text: "Relatórios",
                        URL: "/reports",
                        icon: Report
                    },
                    {
                        text: "WhatsApp",
                        URL: "/whatsapp-logs",
                        icon: BrandWhatsapp
                    },
                ]
            },
            {
                text: "TV Lab",
                URL: "/ranking",
                icon: DeviceTv
            },
        ])
    }

    if ([UserRoles.ScreeningAdministration]?.includes(userRole)) {
        options.push(...[
            {
                text: "Pedidos",
                URL: "/view-orders",
                icon: ReportMoney
            },
            {
                text: "Finanças",
                URL: "/transactions",
                icon: PigMoney,
                child: [
                    {
                        text: "Caixa",
                        URL: "/transactions",
                        icon: ReportMoney
                    },
                    {
                        text: "Cobranças",
                        URL: "/collections",
                        icon: ZoomMoney
                    },
                ]
            },
            {
                text: "BackOffice",
                URL: "/reports",
                icon: Briefcase,
                child: [
                    {
                        text: "Relatórios",
                        URL: "/reports",
                        icon: Report
                    },
                    {
                        text: "WhatsApp",
                        URL: "/whatsapp-logs",
                        icon: BrandWhatsapp
                    },
                ]
            },
            {
                text: "TV Lab",
                URL: "/ranking",
                icon: DeviceTv
            },
        ])
    }

    if ([UserRoles.Root]?.includes(userRole)) {
        options.push(...[
            {
                text: "Pedidos",
                URL: "/view-orders",
                icon: ReportMoney
            },
            {
                text: "Finanças",
                URL: "/financial",
                icon: PigMoney,
                child: [
                    {
                        text: "Financeiro",
                        URL: "/financial",
                        icon: Moneybag,
                    },
                    {
                        text: "Caixa",
                        URL: "/transactions",
                        icon: ReportMoney
                    },
                    {
                        text: "Cobranças",
                        URL: "/collections",
                        icon: ZoomMoney
                    },
                    {
                        text: "Despesas",
                        URL: "/expenses",
                        icon: Checklist
                    },
                ]
            },
            {
                text: "Administrativo",
                URL: "/products",
                icon: Adjustments,
                child: [
                    {
                        text: "Estoque",
                        URL: "/products",
                        icon: Box
                    },
                    {
                        text: "Serviços",
                        URL: "/services-dashboard",
                        icon: Tools
                    },
                    {
                        text: "Clientes",
                        URL: "/clients",
                        icon: Users
                    },

                    {
                        text: "Colaboradores",
                        URL: "/view-users",
                        icon: User
                    },
                ]
            },
            {
                text: "BackOffice",
                URL: "/reports",
                icon: Briefcase,
                child: [
                    {
                        text: "Relatórios",
                        URL: "/reports",
                        icon: Report
                    },
                    {
                        text: "WhatsApp",
                        URL: "/whatsapp-logs",
                        icon: BrandWhatsapp
                    },
                ]
            },
            {
                text: "TV Lab",
                URL: "/ranking",
                icon: DeviceTv
            },
        ])
    }

    return options
}

