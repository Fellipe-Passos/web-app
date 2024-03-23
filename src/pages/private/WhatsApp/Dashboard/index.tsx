import { Badge, Button, Group, Stack, Table } from "@mantine/core";
import { useMutation, useQuery } from "react-query";
import { humanizeCellphone } from "../../../../utils";
import { getLogs, resendMessage } from "./index.service";
import Tabs from "../../../../components/Tabs";
import { useEffect, useState } from "react";

export default function WhatsAppDashboard(): JSX.Element {
  const { data } = useQuery("logs", getLogs);

  const [logs, setLogs] = useState<any[] | undefined>(data);

  const { mutate, isLoading } = useMutation(resendMessage);

  const [active, setActive] = useState<"EXTERNAL" | "INTERNAL">("EXTERNAL");

  const onResendMessage = (
    destinationNumber: number,
    message: string
  ): void => {
    mutate({ destinationNumber, message });
  };

  useEffect(() => {
    if (active === "EXTERNAL") {
      const externalLogs = data?.filter((log: any) => log?.type === "EXTERNAL");

      setLogs(externalLogs);
    }

    if (active === "INTERNAL") {
      const internalLogs = data?.filter((log: any) => log?.type === "INTERNAL");

      setLogs(internalLogs);
    }
  }, [active]);

  return (
    <Stack h={"100%"}>
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
      <Table.ScrollContainer minWidth={"100%"}>
        <Table striped>
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
            {logs?.map((log, index) => (
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

      {/* {!data?.length && <NoData />} */}
    </Stack>
  );
}
