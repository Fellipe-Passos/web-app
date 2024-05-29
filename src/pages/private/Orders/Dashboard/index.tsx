import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Pagination,
  Radio,
  Stack,
  Table,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import {
  Check,
  Download,
  Pencil,
  PigMoney,
  Search,
  Trash,
  X,
} from "tabler-icons-react";
import Loading from "../../../../components/Loading";
import NoData from "../../../../components/NoData";
import Tabs from "../../../../components/Tabs";
import baseURL from "../../../../config/api/baseURL";
import { UserRoles } from "../../../../types/user";
import { formatCurrency } from "../../../../utils";
import { getUserRole } from "../../../../utils/userToken";
import { SendToFinancial } from "../NewOrder/services/send-to-financial.service";
import {
  DeleteOrder,
  FinishOrder,
  countOrders,
  getOrders,
} from "./index.service";
import { getStatus, header } from "./utils/table";

function diffDays(date1: Date, date2: Date): number {
  if (date1.getTime() < date2.getTime()) {
    // Calcula a diferença em milissegundos entre as duas datas
    const diffTime = date2.getTime() - date1.getTime();

    // Converte a diferença de milissegundos para dias
    const diffDays = Math.trunc(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  return 0;
}

function getDaysDelayInfos(daysDelay: number): { text: string; color: string } {
  if (daysDelay) {
    if (daysDelay > 10) {
      return {
        text: `${daysDelay} dias`,
        color: "red",
      };
    } else if (daysDelay >= 5) {
      return {
        text: `${daysDelay} dias`,
        color: "orange",
      };
    } else if (daysDelay > 1 && daysDelay <= 4) {
      return {
        text: `${daysDelay} dias`,
        color: "yellow",
      };
    } else {
      return {
        text: `${daysDelay} dia`,
        color: "teal",
      };
    }
  }
  return {
    text: "Em dias",
    color: "green",
  };
}

export default function OrdersDashboard(): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useDebouncedState("", 200);
  const [activeTab, setActiveTab] = useState<
    "ALL" | "FOR_DELIVERY" | "FINALIZED"
  >("ALL");
  const [loading, setIsLoading] = useState(false);
  const userRole = getUserRole();

  const [filter, setFilter] = useState<
    | "GENERAL"
    | "NO_STEPS "
    | UserRoles.Digital
    | UserRoles.Plaster
    | UserRoles.Milling
    | UserRoles.Finishing
    | "FINISHED_STEPS"
    | "UNDER_ANALYSIS"
  >("GENERAL");

  const {
    isLoading: orderDataIsLoading,
    data: ordersData,
    mutate: getOrdersMutate,
  } = useMutation(getOrders);

  const { data: countOrdersData } = useQuery("count-orders", countOrders);

  const [pagination, setPagination] = useState({
    limit: 11,
    offset: 0,
  });

  const { innerHeight } = window;

  const handleLimit = (): void => {
    const qtd = activeTab === "ALL" ? 10 : 11;

    const countRowsInTable = Math.round((qtd * innerHeight) / 695);

    setPagination({
      ...pagination,
      limit: countRowsInTable,
    });
  };

  window.onresize = () => {
    handleLimit();
  };

  useEffect(() => {
    handleLimit();
  }, [innerHeight, activeTab]);

  useEffect(() => {
    getOrdersMutate({
      type: activeTab,
      search,
      limit: pagination.limit,
      offset: pagination.offset,
      filter,
    });
  }, [activeTab, search, pagination, filter]);

  const { mutate: finishOrderMutate, isLoading: finishOrderIsLoading } =
    useMutation(FinishOrder);

  const { mutate: sendToFinancialMutate, isLoading: sendToFinancialIsLoading } =
    useMutation(SendToFinancial, {
      onSuccess() {
        notifications.show({
          title: "Pedido enviado para o setor financeiro",
          message:
            "A ação de enviar pedido para setor financeiro foi concluída com sucesso!",
          color: "green",
          icon: <Check />,
          styles: (theme) => ({
            root: {
              backgroundColor: theme.colors.green[0],
              borderColor: theme.colors.green[6],

              "&::before": { backgroundColor: theme.white },
            },

            title: { color: theme.colors.green[6] },
            description: { color: theme.colors.green[6] },
            closeButton: {
              color: theme.colors.green[6],
              "&:hover": { backgroundColor: theme.colors.green[1] },
            },
          }),
        });
        queryClient.invalidateQueries(["view-order"]);
        queryClient.invalidateQueries(["user-by-role"]);
      },
      onError(err: any) {
        notifications.show({
          title: "Falha ao reabrir etapa",
          message: err?.response?.data ?? "",
          color: "red",
          icon: <X />,
          styles: (theme) => ({
            root: {
              backgroundColor: theme.colors.red[0],
              borderColor: theme.colors.red[6],

              "&::before": { backgroundColor: theme.white },
            },

            title: { color: theme.colors.red[6] },
            description: { color: theme.colors.red[6] },
            closeButton: {
              color: theme.colors.red[6],
              "&:hover": { backgroundColor: theme.colors.red[1] },
            },
          }),
        });
      },
    });

  const emitForm = async (orderId: number) => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${baseURL.baseURLDev}/form-pdf/${orderId}`,
        {
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(blob);

      setIsLoading(false);

      window.open(fileURL, "_blank");
    } catch (error) {
      setIsLoading(false);

      console.error(error);
    }
  };

  const { mutate: deleteOrderMutate, isLoading: deleteOrderIsLoading } =
    useMutation(DeleteOrder, {
      onSuccess() {
        notifications.show({
          title: "Pedido removido",
          message:
            "O pedido e todos os registros relacionados foram removidos com sucesso!",
          color: "green",
          icon: <Check />,
          styles: (theme) => ({
            root: {
              backgroundColor: theme.colors.green[0],
              borderColor: theme.colors.green[6],

              "&::before": { backgroundColor: theme.white },
            },

            title: { color: theme.colors.green[6] },
            description: { color: theme.colors.green[6] },
            closeButton: {
              color: theme.colors.green[6],
              "&:hover": { backgroundColor: theme.colors.green[1] },
            },
          }),
        });
        window.location.reload();
      },
      onError(err: any) {
        notifications.show({
          title: "Falha ao remover pedido",
          message: err?.response?.data ?? "",
          color: "red",
          icon: <X />,
          styles: (theme) => ({
            root: {
              backgroundColor: theme.colors.red[0],
              borderColor: theme.colors.red[6],

              "&::before": { backgroundColor: theme.white },
            },

            title: { color: theme.colors.red[6] },
            description: { color: theme.colors.red[6] },
            closeButton: {
              color: theme.colors.red[6],
              "&:hover": { backgroundColor: theme.colors.red[1] },
            },
          }),
        });
      },
    });

  const rows =
    ordersData?.orders &&
    ordersData?.orders?.map((order) => {
      const badge = getStatus({
        underAnalysis: order?.underAnalysis,
        delivered: order?.delivered ?? false,
        finished: order?.finished ?? false,
        deliveredAt: order?.deliveredAt ?? null,
        finishedAt: order?.finishedAt ?? null,
        stages: order?.productionStage,
      });

      const date1 = new Date(order?.createdAt);
      date1?.setDate(Number(date1?.getDate() + 3));

      const date2 = new Date();

      const daysDelay = diffDays(date1, date2);

      const delayInfos = getDaysDelayInfos(daysDelay);

      return (
        <Table.Tr key={order?.id}>
          <Table.Td>{order?.id ?? ""}</Table.Td>
          <Table.Td>
            {order?.createdAt
              ? new Date(order?.createdAt)?.toLocaleDateString("pt-br")
              : "-"}
          </Table.Td>
          <Table.Td>
            <Badge variant="light" color={delayInfos?.color}>
              {delayInfos?.text}
            </Badge>
          </Table.Td>
          <Table.Td>{order?.client?.name ?? "-"}</Table.Td>
          <Table.Td>{order?.patientName ?? "-"}</Table.Td>
          {[UserRoles.Ceo, UserRoles.Root]?.includes(userRole as UserRoles) && (
            <Table.Td>{formatCurrency(order?.price ?? 0)}</Table.Td>
          )}
          <Table.Td>
            <Badge color={badge?.color}>{badge?.text}</Badge>
          </Table.Td>
          <Table.Td>
            <Group>
              <Tooltip label="Imprimir ficha">
                <ActionIcon
                  color="grape"
                  onClick={() => emitForm(order?.id)}
                  loading={loading}
                >
                  <Download />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Editar pedido">
                <ActionIcon
                  color="cyan"
                  onClick={() => navigate(`/edit-order/${order?.id}`)}
                >
                  <Pencil />
                </ActionIcon>
              </Tooltip>
              {activeTab === "ALL" && (
                <Tooltip label="Enviar pedido para o financeiro">
                  <ActionIcon
                    disabled={badge?.text !== "Liberar para financeiro"}
                    color="teal"
                    onClick={() => {
                      sendToFinancialMutate({ orderId: Number(order?.id) });
                    }}
                    loading={sendToFinancialIsLoading}
                  >
                    <PigMoney />
                  </ActionIcon>
                </Tooltip>
              )}
              {["Aguardando pagamento", "Pago"]?.includes(badge?.text) &&
                activeTab === "FOR_DELIVERY" && (
                  <Tooltip label="Finalizar pedido">
                    <ActionIcon
                      color="yellow"
                      onClick={() =>
                        finishOrderMutate(
                          { orderId: Number(order?.id) },
                          {
                            onSuccess() {
                              window.location.reload();
                            },
                          }
                        )
                      }
                      loading={finishOrderIsLoading}
                    >
                      <Check />
                    </ActionIcon>
                  </Tooltip>
                )}
              {[UserRoles.Ceo, UserRoles.Root, UserRoles.Manager]?.includes(
                userRole as UserRoles
              ) &&
                [UserRoles.Manager]?.includes(userRole as UserRoles) &&
                activeTab !== "FOR_DELIVERY" && (
                  <Tooltip label="Deletar pedido">
                    <ActionIcon
                      color="red"
                      variant="filled"
                      radius={"xl"}
                      size={"md"}
                      loading={deleteOrderIsLoading}
                      onClick={() => {
                        deleteOrderMutate({ orderId: order?.id });
                      }}
                    >
                      <Trash />
                    </ActionIcon>
                  </Tooltip>
                )}
            </Group>
          </Table.Td>
        </Table.Tr>
      );
    });

  return (
    <Stack h="100%" style={{ gap: ".5rem" }}>
      <Group justify="space-between">
        <TextInput
          placeholder="Buscar"
          leftSection={<Search />}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        {!search?.trim()?.length && (
          <Tabs
            tabs={[
              { label: "Todos os pedidos", value: "ALL" },
              { label: "Pedidos no setor financeiro", value: "FOR_DELIVERY" },
              { label: "Pedidos finalizados", value: "FINALIZED" },
            ]}
            defaultValue={activeTab}
            onChange={async (e: "ALL" | "FOR_DELIVERY" | "FINALIZED") => {
              setPagination({
                ...pagination,
                offset: 0,
              });
              setActiveTab(e);
            }}
          />
        )}
        {[
          UserRoles.ScreeningAdministration,
          UserRoles.Ceo,
          UserRoles.Root,
        ]?.includes(userRole as UserRoles) ? (
          <Group>
            <Button variant="light" onClick={() => navigate("/new-order")}>
              Adicionar novo pedido
            </Button>
          </Group>
        ) : (
          <div />
        )}
      </Group>
      {activeTab === "ALL" && (
        <Radio.Group
          label="Filtro por status"
          value={filter}
          onChange={(e) =>
            setFilter(
              e as
                | "GENERAL"
                | "NO_STEPS "
                | UserRoles.Digital
                | UserRoles.Plaster
                | UserRoles.Milling
                | UserRoles.Finishing
                | "FINISHED_STEPS"
                | "UNDER_ANALYSIS"
            )
          }
        >
          <Group>
            <Radio
              label={`Geral - ${countOrdersData?.general ?? 0}`}
              value={"GENERAL"}
            />
            <Radio
              label={`Em análise - ${countOrdersData?.underAnalysis ?? 0}`}
              value={"UNDER_ANALYSIS"}
            />
            <Radio
              label={`Sem etapas - ${countOrdersData?.noSteps ?? 0}`}
              value={"NO_STEPS"}
            />
            <Radio
              label={`Gesso - ${countOrdersData?.plaster ?? 0}`}
              value={UserRoles.Plaster}
            />
            <Radio
              label={`Digital - ${countOrdersData?.digital ?? 0}`}
              value={UserRoles.Digital}
            />
            <Radio
              label={`Fresagem - ${countOrdersData?.milling ?? 0}`}
              value={UserRoles.Milling}
            />
            <Radio
              label={`Acabamento - ${countOrdersData?.finishing ?? 0}`}
              value={UserRoles.Finishing}
            />
            <Radio
              label={`Etapas finalizadas - ${
                countOrdersData?.finishedSteps ?? 0
              }`}
              value={"FINISHED_STEPS"}
            />
          </Group>
        </Radio.Group>
      )}
      <Box h={"100%"}>
        {ordersData?.orders?.length && !orderDataIsLoading ? (
          <Table.ScrollContainer minWidth={"100%"}>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <Table.Thead>
                {header(userRole as UserRoles)?.map((h) => (
                  <Table.Th key={h}>{h}</Table.Th>
                ))}
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        ) : null}
        {orderDataIsLoading && <Loading />}
        {!orderDataIsLoading && !ordersData?.orders?.length && <NoData />}
      </Box>
      <Group justify="center">
        <Pagination
          total={Math.ceil(
            Number(ordersData?.totalCount) / Number(pagination.limit)
          )}
          onChange={(e) => {
            setPagination({
              ...pagination,
              offset: Number(e - 1) * Number(pagination?.limit),
            });
          }}
        />
      </Group>
    </Stack>
  );
}
