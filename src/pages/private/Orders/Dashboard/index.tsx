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
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { Check, Download, Pencil, PigMoney, Search } from "tabler-icons-react";
import Loading from "../../../../components/Loading";
import Tabs from "../../../../components/Tabs";
import baseURL from "../../../../config/api/baseURL";
import { formatCurrency } from "../../../../utils";
import { listOrdersInProgress } from "./index.service";
import { getStatus, header } from "./utils/table";

export default function OrdersDashboard(): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useDebouncedState("", 200);
  const [activeTab, setActiveTab] = useState<
    "IN_PROGRESS" | "WAITING_STEPS" | "FOR_DELIVERY" | "FINALIZED"
  >("IN_PROGRESS");
  const [loading, setIsLoading] = useState(false);

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

      return (
        <Table.Tr key={order?.id}>
          <Table.Td>{order?.id ?? ""}</Table.Td>
          <Table.Td>
            {order?.createdAt
              ? new Date(order?.createdAt)?.toLocaleDateString("pt-br")
              : "-"}
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
              {activeTab === "IN_PROGRESS" && (
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
              { label: "Em andamento", value: "IN_PROGRESS" },
              { label: "Aguardando etapas", value: "WAITING_STEPS" },
              { label: "Financeiro", value: "FOR_DELIVERY" },
              { label: "Finalizado", value: "FINALIZED" },
            ]}
            defaultValue={activeTab}
            onChange={async (
              e: "IN_PROGRESS" | "WAITING_STEPS" | "FOR_DELIVERY" | "FINALIZED"
            ) => {
              setActiveTab(e);
              await queryClient.fetchQuery("list-orders", () =>
                listOrdersInProgress(e)
              );
            }}
          />
        )}
        <Button onClick={() => navigate("/new-order")}>
          Adicionar novo pedido
        </Button>
      </Group>
      {ordersData?.length && !orderDataIsLoading && (
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
      )}
      {orderDataIsLoading && <Loading />}
    </Stack>
  );
}
