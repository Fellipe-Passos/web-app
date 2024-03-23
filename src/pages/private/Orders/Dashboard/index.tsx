import {
  ActionIcon,
  Badge,
  Button,
  Group,
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
import { DeleteOrder, listOrdersInProgress } from "./index.service";
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
    "ALL" | "IN_PROGRESS" | "WAITING_STEPS" | "FOR_DELIVERY" | "FINALIZED"
  >("ALL");
  const [loading, setIsLoading] = useState(false);
  const userRole = getUserRole();

  const { isFetching: orderDataIsLoading, data: ordersData } = useQuery(
    ["list-orders"],
    () => listOrdersInProgress(activeTab)
  );

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
    ordersData &&
    ordersData.map((order) => {
      const badge = getStatus({
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
          <Table.Td>{formatCurrency(order?.price ?? 0)}</Table.Td>
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
                  >
                    <PigMoney />
                  </ActionIcon>
                </Tooltip>
              )}
              {badge?.text === "Aguardando pagamento" &&
                activeTab === "FOR_DELIVERY" && (
                  <Tooltip label="Finalizar pedido">
                    <ActionIcon color="yellow">
                      <Check />
                    </ActionIcon>
                  </Tooltip>
                )}
              {[UserRoles.Ceo, UserRoles.Root]?.includes(
                userRole as UserRoles
              ) && (
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

  const onSearch = async () => {
    await queryClient.fetchQuery("list-orders", () =>
      listOrdersInProgress(undefined, search)
    );
  };

  const onClearSearch = async () => {
    await queryClient.fetchQuery("list-orders", () =>
      listOrdersInProgress(activeTab)
    );
  };

  useEffect(() => {
    const hasSearch = Boolean(search?.trim()?.length);

    if (hasSearch) {
      onSearch();
    } else {
      onClearSearch();
    }
  }, [search]);

  return (
    <Stack h="100%">
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
            onChange={async (
              e:
                | "ALL"
                | "IN_PROGRESS"
                | "WAITING_STEPS"
                | "FOR_DELIVERY"
                | "FINALIZED"
            ) => {
              setActiveTab(e);
              await queryClient.fetchQuery("list-orders", () =>
                listOrdersInProgress(e)
              );
            }}
          />
        )}
        <Group>
          <Button onClick={() => navigate("/new-order")}>
            Adicionar novo pedido
          </Button>
        </Group>
      </Group>
      {ordersData?.length && !orderDataIsLoading ? (
        <Table.ScrollContainer minWidth={"100%"}>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              {header.map((h) => (
                <Table.Th key={h}>{h}</Table.Th>
              ))}
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      ) : null}
      {orderDataIsLoading && <Loading />}
      {!orderDataIsLoading && !ordersData?.length && <NoData />}
    </Stack>
  );
}
