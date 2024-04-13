import AddClient from "../../pages/private/Clients/AddClient";
import ClientsDashboard from "../../pages/private/Clients/Dashboard";
import Collections from "../../pages/private/Collections/Dashboard";
import CreatePayroll from "../../pages/private/Expenses/Employees/CreatePayroll";
import CreateExpense from "../../pages/private/Expenses/Expenses/Create";
import Expenses from "../../pages/private/Expenses/Expenses/Dashboard";
import Financial from "../../pages/private/Financial";
import OrdersDashboard from "../../pages/private/Orders/Dashboard";
import NewOrder from "../../pages/private/Orders/NewOrder";
import AddProduct from "../../pages/private/Products/AddProduct";
import ProductsDashboard from "../../pages/private/Products/Dashboard";
import Ranking from "../../pages/private/Ranking";
import Reports from "../../pages/private/Reports";
import AddNewService from "../../pages/private/Services/AddService";
import ServicesDashboard from "../../pages/private/Services/Dashboard";
import TransactionsDashboard from "../../pages/private/Transactions/Dashboard";
import AddUser from "../../pages/private/Users/AddUser";
import ViewUsers from "../../pages/private/Users/ViewUsers";
import WhatsAppDashboard from "../../pages/private/WhatsApp/Dashboard";
import { RoutesType } from "../../types/routesTypes";

export const homeRoutes: RoutesType[] = [
  {
    isPrivate: true,
    path: "/view-orders",
    element: <OrdersDashboard />,
    title: "Pedidos",
  },
  {
    isPrivate: true,
    path: "/new-order",
    element: <NewOrder />,
    title: "Novo pedido",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/edit-order/:orderId",
    element: <NewOrder />,
    title: "Editar e acompanhar pedido",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/transactions",
    element: <TransactionsDashboard />,
    title: "Fluxo de caixa",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/products",
    element: <ProductsDashboard />,
    title: "Estoque",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/add-product",
    element: <AddProduct />,
    title: "Adicionar novo produto",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/edit-product/:productId",
    element: <AddProduct />,
    title: "Editar produto",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/services-dashboard",
    element: <ServicesDashboard />,
    title: "Procedimentos",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/services",
    element: <AddNewService />,
    title: "Adicionar procedimento",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/edit-service/:serviceId",
    element: <AddNewService />,
    title: "Editar procedimento",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/financial",
    element: <Financial />,
    title: "Financeiro",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/clients",
    element: <ClientsDashboard />,
    title: "Clientes",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/add-client",
    element: <AddClient />,
    title: "Adicionar cliente",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/edit-client/:clientId",
    element: <AddClient />,
    title: "Editar cliente",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/view-users",
    element: <ViewUsers />,
    title: "Colaboradores",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/add-user",
    element: <AddUser />,
    title: "Adicionar colaborador",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/ranking",
    element: <Ranking />,
    title: "Ranking",
    returnButton: true,
    fullScreen: true,
  },
  {
    isPrivate: false,
    path: "/ranking/full",
    element: <Ranking />,
    title: "Ranking",
    returnButton: false,
    fullScreen: false,
  },
  {
    isPrivate: true,
    path: "/reports",
    element: <Reports />,
    title: "Relatórios",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/whatsapp-logs",
    element: <WhatsAppDashboard />,
    title: "Histórico de mensagens",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/expenses",
    element: <Expenses />,
    title: "Despesas",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/create-expense",
    element: <CreateExpense />,
    title: "Adicionar despesa",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/create-payroll",
    element: <CreatePayroll />,
    title: "Adicionar à folha de pagamento",
    returnButton: true,
  },
  {
    isPrivate: true,
    path: "/collections",
    element: <Collections />,
    title: "Histórico de cobranças",
    returnButton: true,
  },
];
