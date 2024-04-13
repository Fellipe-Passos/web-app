import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getPayments } from "../../services/payments.service";
import { Anchor, Badge, Stack, Table } from "@mantine/core";
import { formatCurrency } from "../../../../../../utils";
import NoData from "../../../../../../components/NoData";
import Loading from "../../../../../../components/Loading";

type StatusType = "RECEIVED" | "PENDING" | "OVERDUE" | "CANCELLED";

export default function PaymentData(): JSX.Element {
  const { orderId } = useParams();

  const {
    data: orderPaymentData,
    isFetching,
    isLoading,
  } = useQuery("list-payment", () => getPayments(Number(orderId)), {
    enabled: Boolean(orderId),
  });

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

  const loading = isLoading || isFetching;

  return (
    <Stack h={"100%"} mt={"1rem"}>
      {orderPaymentData?.data?.length && !loading ? (
        <Table.ScrollContainer minWidth={"100%"}>
          <Table striped withTableBorder withColumnBorders highlightOnHover>
            <Table.Thead>
              <Table.Th>Data de vencimento</Table.Th>
              <Table.Th>Nº da parcela</Table.Th>
              <Table.Th>Valor da parcela</Table.Th>
              <Table.Th>Valor total</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Pago em</Table.Th>
              <Table.Th>Boleto</Table.Th>
            </Table.Thead>
            <Table.Tbody>
              {orderPaymentData?.data?.map((invoice: any, index: number) => (
                <Table.Tr key={index}>
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
                    <Badge
                      color={STATUSES[invoice?.status as StatusType]?.color}
                    >
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
      ) : null}
      {!loading && !orderPaymentData?.data?.length && <NoData />}
      {loading && !orderPaymentData?.data?.length && <Loading />}
    </Stack>
  );
}
