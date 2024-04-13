import { Badge, Button, Group, Pagination, Stack, Table } from "@mantine/core";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import Tabs from "../../../../components/Tabs";
import { humanizeCellphone } from "../../../../utils";
import { getLogs, resendMessage } from "./index.service";
import NoData from "../../../../components/NoData";
import Loading from "../../../../components/Loading";

export default function WhatsAppDashboard(): JSX.Element {
  const {
    data,
    mutate: getLogsMutate,
    isLoading: getLogsLoading,
  } = useMutation(getLogs);

  const { mutate, isLoading } = useMutation(resendMessage);

  const [active, setActive] = useState<"EXTERNAL" | "INTERNAL">("EXTERNAL");

  const [pagination, setPagination] = useState({
    limit: 13,
    offset: 0,
  });

  const { innerHeight } = window;

  const handleLimit = (): void => {
    const countRowsInTable = Math.round((13 * innerHeight) / 947);

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
  }, [innerHeight]);

  useEffect(() => {
    getLogsMutate({
      type: active,
      limit: pagination.limit,
      offset: pagination.offset,
    });
  }, [active, pagination]);

  const onResendMessage = (
    destinationNumber: number,
    message: string
  ): void => {
    mutate({ destinationNumber, message });
  };

  return (
    <Stack h={"100%"} style={{ gap: ".5rem" }}>
      <Group justify="center">
        <Tabs
          defaultValue={active}
          tabs={[
            { label: "Externo", value: "EXTERNAL" },
            { label: "Interno", value: "INTERNAL" },
          ]}
          onChange={(e: "EXTERNAL" | "INTERNAL") => setActive(e)}
        />
      </Group>

      {data?.logs?.length && !getLogsLoading ? (
        <Table.ScrollContainer minWidth={"100%"}>
          <Table striped withTableBorder withColumnBorders highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Id</Table.Th>
                <Table.Th>Data</Table.Th>
                <Table.Th>Pedido</Table.Th>
                <Table.Th>Cliente</Table.Th>
                <Table.Th>Telefone</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Mensagem</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data?.logs?.map((log, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{log?.id ?? "-"}</Table.Td>
                  <Table.Td>
                    {log?.createdAt
                      ? new Date(log?.createdAt)?.toLocaleString("pt-br", {
                          timeZone: "UTC",
                        })
                      : "-"}
                  </Table.Td>
                  <Table.Td>{log?.orderId ?? "-"}</Table.Td>
                  <Table.Td>{log?.client?.name ?? "-"}</Table.Td>
                  <Table.Td>
                    {log?.client?.phone
                      ? humanizeCellphone(log?.client?.phone)
                      : "-"}
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        log?.status === "SENDED"
                          ? "green"
                          : log?.status === "NOT_SENDED"
                          ? "red"
                          : "grey"
                      }
                    >
                      {log?.status === "SENDED"
                        ? "Enviado"
                        : log?.status === "NOT_SENDED"
                        ? "Não enviado"
                        : "-"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{log?.message ?? "-"}</Table.Td>
                  <Table.Td>
                    <Button
                      variant="light"
                      onClick={() =>
                        onResendMessage(log?.client?.phone, log?.message)
                      }
                      loading={isLoading}
                    >
                      Reenviar
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      ) : null}

      {!data?.logs?.length && !getLogsLoading ? <NoData /> : null}

      {getLogsLoading && <Loading />}

      <Group justify="center">
        <Pagination
          total={Math.ceil(Number(data?.totalCount) / Number(pagination.limit))}
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
