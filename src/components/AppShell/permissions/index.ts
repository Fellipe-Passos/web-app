import { Box, BrandWhatsapp, ChartBar, Checklist, Home, Moneybag, Report, ReportMoney, Tools, User, Users } from "tabler-icons-react";
import { UserRoles } from "../../../types/user";

export const navbarOptions = (userRole: UserRoles): any[] => {
    const options: any[] = []

    if ([UserRoles.Ceo]?.includes(userRole)) {
        options.push(...[
            {
                text: "Inicio",
                URL: "/home",
                icon: Home
            },
            {
                text: "Usuários",
                URL: "/view-users",
                icon: User
            },
            {
                text: "Clientes",
                URL: "/clients",
                icon: Users
            },
            {
                text: "Caixa",
                URL: "/transactions",
                icon: ReportMoney
            },
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
                text: "Pedidos",
                URL: "/view-orders",
                icon: ReportMoney
            },
            {
                text: "Financeiro",
                URL: "/financial",
                icon: Moneybag
            },
            {
                text: "Rankings",
                URL: "/ranking",
                icon: ChartBar
            },
            {
                text: "Relatórios",
                URL: "/reports",
                icon: Report
            },
        ])
    }

    if ([UserRoles?.Manager]?.includes(userRole)) {
        options.push(...[
            {
                text: "Inicio",
                URL: "/home",
                icon: Home
            },
            {
                text: "Usuários",
                URL: "/view-users",
                icon: User
            },
            {
                text: "Clientes",
                URL: "/clients",
                icon: Users
            },
            {
                text: "Caixa",
                URL: "/transactions",
                icon: ReportMoney
            },
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
                text: "Pedidos",
                URL: "/view-orders",
                icon: ReportMoney
            },
            {
                text: "Rankings",
                URL: "/ranking",
                icon: ChartBar
            },
            {
                text: "Relatórios",
                URL: "/reports",
                icon: Report
            },
        ])
    }

    if ([UserRoles.Administration]?.includes(userRole)) {
        options.push(...[
            {
                text: "Inicio",
                URL: "/home",
                icon: Home
            },
            {
                text: "Clientes",
                URL: "/clients",
                icon: Users
            },
            {
                text: "Caixa",
                URL: "/transactions",
                icon: ReportMoney
            },
            {
                text: "Pedidos",
                URL: "/view-orders",
                icon: ReportMoney
            },
            {
                text: "Rankings",
                URL: "/ranking",
                icon: ChartBar
            },
            {
                text: "Relatórios",
                URL: "/reports",
                icon: Report
            },
        ])
    }

    if ([UserRoles.ScreeningAdministration]?.includes(userRole)) {
        options.push(...[
            {
                text: "Inicio",
                URL: "/home",
                icon: Home
            },
            {
                text: "Pedidos",
                URL: "/view-orders",
                icon: ReportMoney
            },
            {
                text: "Rankings",
                URL: "/ranking",
                icon: ChartBar
            },
            {
                text: "Relatórios",
                URL: "/reports",
                icon: Report
            },
            {
                text: "Caixa",
                URL: "/transactions",
                icon: ReportMoney
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
                text: "Caixa",
                URL: "/transactions",
                icon: ReportMoney
            },
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
                text: "Financeiro",
                URL: "/financial",
                icon: Moneybag
            },
            {
                text: "Despesas",
                URL: "/expenses",
                icon: Checklist
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
            {
                text: "TV Lab",
                URL: "/ranking",
                icon: ChartBar
            },
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
        ])
    }

    return options
}

