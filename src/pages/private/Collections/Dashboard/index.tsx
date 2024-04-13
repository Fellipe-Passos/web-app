import { Anchor, Badge, Group, Pagination, Stack, Table } from "@mantine/core";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { formatCurrency } from "../../../../utils";
import { getCollections } from "./services/get-collections";

type StatusType = "RECEIVED" | "PENDING" | "OVERDUE" | "CANCELLED";

export default function Collections() {
  const [pagination, setPagination] = useState({
    limit: 12,
    offset: 0,
  });

  const { innerHeight } = window;

  const handleLimit = (): void => {
    const countRowsInTable = Math.round((12 * innerHeight) / 695);

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

  const { data, mutate } = useMutation(getCollections);

  useEffect(() => {
    mutate(pagination);
  }, [pagination]);

  const STATUSES = {
    RECEIVED: {
      text: "PAGO",
      color: "green",
    },
    PENDING: {
      text: "AGUARDANDO PAGAMENTO",
      color: "yellow",
    },
    OVERDUE: {
      text: "PAGAMENTO ATRASADO",
      color: "orange",
    },
    CANCELLED: {
      text: "CANCELADO",
      color: "red",
    },
  };

  console.log(data);

  return (
    <Stack h={"100%"}>
      <Table.ScrollContainer minWidth={"100%"}>
        <Table striped withTableBorder withColumnBorders highlightOnHover>
          <Table.Thead>
            <Table.Th>Pedido</Table.Th>
            <Table.Th>Data de criação</Table.Th>
            <Table.Th>Data de vencimento</Table.Th>
            <Table.Th>Nº da parcela</Table.Th>
            <Table.Th>Valor da parcela</Table.Th>
            <Table.Th>Valor total</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Pago em</Table.Th>
            <Table.Th>Boleto</Table.Th>
          </Table.Thead>
          <Table.Tbody>
            {data?.data?.map((invoice: any, index: number) => (
              <Table.Tr key={index}>
                <Table.Td>{invoice?.externalReference ?? "-"}</Table.Td>
                <Table.Td>
                  {invoice?.dateCreated
                    ? new Date(
                        new Date(invoice.dateCreated)?.setHours(24, 0, 0, 0)
                      )?.toLocaleDateString("pt-br")
                    : "-"}
                </Table.Td>
                <Table.Td>
                  {invoice?.dueDate
                    ? new Date(
                        new Date(invoice.dueDate)?.setHours(24, 0, 0, 0)
                      )?.toLocaleDateString("pt-br")
                    : "-"}
                </Table.Td>
                <Table.Td>{invoice?.installmentNumber ?? "-"}</Table.Td>
                <Table.Td>
                  {formatCurrency(invoice?.installmentAmount ?? 0)}
                </Table.Td>
                <Table.Td>{formatCurrency(invoice?.value ?? 0)}</Table.Td>
                <Table.Td>
                  <Badge color={STATUSES[invoice?.status as StatusType]?.color}>
                    {STATUSES[invoice?.status as StatusType]?.text}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  {invoice?.paymentDate
                    ? new Date(
                        new Date(invoice.paymentDate)?.setHours(24, 0, 0, 0)
                      )?.toLocaleDateString("pt-br")
                    : "-"}
                </Table.Td>
                <Table.Td>
                  <Anchor
                    href={invoice?.bankSlipUrl ?? invoice?.invoiceUrl}
                    target="_blank"
                  >
                    Visualizar boleto
                  </Anchor>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
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
