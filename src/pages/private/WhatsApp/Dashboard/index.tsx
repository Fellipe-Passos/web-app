import { Badge, Button, Stack, Table } from "@mantine/core";
import { useMutation, useQuery } from "react-query";
import { humanizeCellphone } from "../../../../utils";
import { getLogs, resendMessage } from "./index.service";

export default function WhatsAppDashboard(): JSX.Element {
  const { data } = useQuery("logs", getLogs);
  const { mutate, isLoading } = useMutation(resendMessage);

  const onResendMessage = (
    destinationNumber: number,
    message: string
  ): void => {
    mutate({ destinationNumber, message });
  };

  return (
    <Stack h={"100%"}>
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
            {data?.map((log, index) => (
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
