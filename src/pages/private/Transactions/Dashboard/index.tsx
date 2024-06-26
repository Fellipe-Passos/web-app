import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  Group,
  Modal,
  MultiSelect,
  Radio,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Check, Eye, ReportMoney, X } from "tabler-icons-react";
import {
  TransactionsEnum,
  getOrdersToSelect,
  getTransactionsByCustomer,
  getTransactionsCustomer,
  reportTransaction,
} from "./index.service";

import { DateInput } from "@mantine/dates";
import { useForm, yupResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import Loading from "../../../../components/Loading";
import NoData from "../../../../components/NoData";
import { BillingTypesEnum } from "../../../../types/billingTypes";
import { UserRoles } from "../../../../types/user";
import {
  formatCurrency,
  removeCPFMask,
  removeCurrencyMask,
} from "../../../../utils";
import { getUserRole } from "../../../../utils/userToken";
import { getOrders } from "../../Orders/Dashboard/index.service";
import {
  getClientsToSelect,
  listClients,
} from "../../Orders/NewOrder/services/clients.service";
import { transactionSchema, transactionValues } from "./schema";

interface ModalProps {
  opened: boolean;
  title: string;
  type: "REPORT" | "LIST";
  clientId?: number;
}

export default function TransactionsDashboard(): JSX.Element {
  const [modalInfos, setModalInfos] = useState<ModalProps | null>();
  const userRole = getUserRole();

  const queryClient = useQueryClient();

  const { data: ordersData, mutate: getOrdersMutate } = useMutation(getOrders);

  useEffect(() => {
    getOrdersMutate({
      type: "FOR_DELIVERY",
      limit: 50,
      offset: 0,
    });
  }, []);

  const { data } = useQuery(
    "transactions-by-customer",
    getTransactionsByCustomer
  );

  const {
    data: customerTransactions,
    isLoading: customerTransactionsIsLoading,
  } = useQuery(
    "transactions-customer",
    () => getTransactionsCustomer(modalInfos?.clientId),
    { enabled: Boolean(modalInfos?.clientId) }
  );

  const { data: clientsData } = useQuery("list-clients", listClients);

  const { mutate, isLoading } = useMutation(reportTransaction);

  const form = useForm({
    validate: yupResolver(transactionSchema),
    initialValues: transactionValues,
    validateInputOnChange: true,
  });

  const onSubmit = () => {
    const { hasErrors } = form.validate();

    if (hasErrors) return;

    const {
      clientId,
      description,
      type,
      value,
      billingType,
      dueDate,
      installmentCount,
      installmentValue,
      orderId,
      emitCollection,
      discountInMoney,
    } = form.values;

    const dataToSend: any = {
      emitCollection: Boolean(emitCollection),
      manualInput: true,
      value: value?.includes("R$") ? removeCurrencyMask(value) : Number(value),
      description,
      clientId: Number(clientId),
      type: type as unknown as TransactionsEnum,
      orderId,
    };

    if (discountInMoney?.trim()?.length) {
      if (discountInMoney?.includes("R$")) {
        dataToSend.discount = removeCurrencyMask(discountInMoney);
      } else {
        dataToSend.discount = Number(discountInMoney);
      }
    } else {
      dataToSend.discount = 0;
    }

    if (billingType)
      dataToSend.billingType = [
        BillingTypesEnum.Boleto,
        BillingTypesEnum.BoletoParcelado,
      ]?.includes(billingType)
        ? "BOLETO"
        : "PIX";

    if (dueDate) dataToSend.dueDate = dueDate;

    if (installmentCount)
      dataToSend.installmentCount = removeCPFMask(installmentCount);

    if (installmentValue)
      dataToSend.installmentValue = removeCurrencyMask(installmentValue);

    mutate(dataToSend, {
      onSuccess() {
        queryClient.invalidateQueries(["transactions-by-customer"]);
        notifications.show({
          title: "Transação reportada",
          message: "A ação de reportar transação foi concluída com sucesso!",
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
        setModalInfos(null);
        form.reset();
      },
      onError(err: any) {
        setModalInfos(null);
        form.reset();
        notifications.show({
          title: "Falha ao reportar transação",
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
  };

  const filteredOrders = ordersData?.orders?.filter(
    (order: any) => Number(order?.client?.id) === Number(form.values.clientId)
  );

  useEffect(() => {
    if (form.values.type === TransactionsEnum.CREDIT) {
      if (Array.isArray(form.values?.orderId) && ordersData?.orders) {
        let totalValue = 0;

        form.values.orderId?.forEach((orderId) => {
          const selectedOrder = ordersData.orders.find(
            (order) => Number(order.id) === Number(orderId)
          );
          if (selectedOrder) {
            totalValue += Number(selectedOrder.price);
          }
        });

        form.setFieldValue("value", `${totalValue}`);
      }
    }
  }, [form.values.orderId]);

  useEffect(() => {
    const { value, discountInMoney } = form.values;

    if (discountInMoney) {
      const percentage =
        (removeCurrencyMask(discountInMoney) / removeCurrencyMask(value)) * 100;

      form.setFieldValue("discount", percentage?.toString());
    }
  }, [form.values.discountInMoney]);

  const renderReportType = (): JSX.Element => {
    return (
      <Stack>
        <Radio.Group
          label="Tipo de transação"
          withAsterisk
          styles={{
            label: {
              fontWeight: 700,
            },
          }}
          {...form.getInputProps("type")}
        >
          <Group style={{ gap: "2rem" }}>
            <Radio label="Débito" value={TransactionsEnum.DEBT} />
            <Radio label="Crédito" value={TransactionsEnum.CREDIT} />
          </Group>
        </Radio.Group>
        <Select
          label="Cliente"
          data={getClientsToSelect(clientsData)}
          searchable
          clearable
          withAsterisk
          {...form.getInputProps("clientId")}
        />

        <MultiSelect
          label="Pedido"
          data={getOrdersToSelect(filteredOrders)}
          searchable
          clearable
          withAsterisk
          {...form.getInputProps("orderId")}
        />

        <SimpleGrid cols={form.values.type === TransactionsEnum.DEBT ? 1 : 3}>
          <NumericFormat
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            customInput={TextInput}
            label="Valor da transação"
            withAsterisk
            {...form.getInputProps("value")}
          />
          {form.values.type === TransactionsEnum.CREDIT && (
            <>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                customInput={TextInput}
                label="Valor do desconto (R$)"
                {...form.getInputProps("discountInMoney")}
              />
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                suffix=" %"
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                customInput={TextInput}
                label="Valor do desconto (%)"
                disabled
                {...form.getInputProps("discount")}
              />
            </>
          )}
        </SimpleGrid>
        <Textarea
          label="Descrição"
          withAsterisk
          {...form.getInputProps("description")}
        />
        {form.values.type === TransactionsEnum.CREDIT && (
          <Checkbox
            label="Emissão de cobrança pela ASAAS"
            description="Ao selecionar esta opção, será gerada uma cobrança para o cliente na ASAAS. Caso contrário, apenas o registro da transação será reportada."
            {...form.getInputProps("emitCollection", { type: "checkbox" })}
          />
        )}
        {form.values.type === TransactionsEnum.CREDIT &&
          form.values.emitCollection && (
            <>
              <Radio.Group
                label="Tipo de cobrança"
                withAsterisk
                styles={{
                  label: {
                    fontWeight: 700,
                  },
                }}
                {...form.getInputProps("billingType")}
              >
                <Group style={{ gap: "2rem" }}>
                  <Radio label="Boleto único" value={BillingTypesEnum.Boleto} />
                  <Radio
                    label="Boleto parcelado"
                    value={BillingTypesEnum.BoletoParcelado}
                  />
                  <Radio label="PIX" value={BillingTypesEnum.PIX} />
                </Group>
              </Radio.Group>

              <DateInput
                label="Data de vencimento"
                {...form.getInputProps("dueDate")}
              />

              {form.values.billingType === BillingTypesEnum.BoletoParcelado && (
                <SimpleGrid cols={2}>
                  <NumericFormat
                    suffix=" x"
                    allowNegative={false}
                    customInput={TextInput}
                    label="Quantidade de parcelas"
                    {...form.getInputProps("installmentCount")}
                  />

                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    customInput={TextInput}
                    label="Valor da parcela"
                    withAsterisk
                    {...form.getInputProps("installmentValue")}
                  />
                </SimpleGrid>
              )}
            </>
          )}
        <Group justify="space-between">
          <Button
            radius={"xl"}
            variant="outline"
            onClick={() => setModalInfos(null)}
          >
            Cancelar
          </Button>
          <Button radius={"xl"} loading={isLoading} onClick={() => onSubmit()}>
            Salvar
          </Button>
        </Group>
      </Stack>
    );
  };

  const renderListType = (): JSX.Element => {
    return (
      <>
        <Table.ScrollContainer minWidth={"100%"} h={"60vh"} mah={"60vh"}>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ paddingLeft: "1rem" }}>Data</Table.Th>
                {[UserRoles.Root, UserRoles.Ceo]?.includes(
                  userRole as UserRoles
                ) && <Table.Th>Criado por</Table.Th>}
                <Table.Th>Descrição</Table.Th>
                <Table.Th>Input Manual</Table.Th>
                <Table.Th>Pedido</Table.Th>
                <Table.Th>Tipo</Table.Th>
                <Table.Th>Valor</Table.Th>
                <Table.Th>Desconto</Table.Th>
                <Table.Th>Valor final</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {customerTransactions?.length &&
                !customerTransactionsIsLoading &&
                customerTransactions?.map((transaction, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      {transaction?.createdAt
                        ? new Date(transaction?.createdAt)?.toLocaleDateString(
                            "pt-br"
                          )
                        : "-"}
                    </Table.Td>
                    {[UserRoles.Root, UserRoles.Ceo]?.includes(
                      userRole as UserRoles
                    ) && <Table.Td>{transaction?.user?.name ?? "-"}</Table.Td>}
                    <Table.Td>{transaction?.description ?? "-"}</Table.Td>
                    <Table.Td>
                      <Badge color={transaction?.manualInput ? "green" : "red"}>
                        {transaction?.manualInput ? "Sim" : "Não"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{transaction?.orderId ?? "-"}</Table.Td>
                    <Table.Td>
                      <Badge
                        color={
                          transaction?.type === TransactionsEnum.CREDIT
                            ? "green"
                            : "red"
                        }
                      >
                        {transaction?.type === TransactionsEnum.CREDIT
                          ? "Crédito"
                          : "Débito"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text
                        fw={700}
                        c={
                          transaction?.type === TransactionsEnum.CREDIT
                            ? "green"
                            : "red"
                        }
                      >
                        {formatCurrency(transaction?.value ?? 0)}
                      </Text>
                    </Table.Td>
                    <Table.Td>{`${transaction?.discount ?? 0}%`}</Table.Td>
                    <Table.Td>
                      {formatCurrency(transaction?.finalValue ?? 0)}
                    </Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        {!customerTransactions?.length && !customerTransactionsIsLoading && (
          <Box h={"50vh"}>
            <NoData />
          </Box>
        )}
        {!customerTransactions?.length && customerTransactionsIsLoading && (
          <Box h={"50vh"}>
            <Loading />
          </Box>
        )}
      </>
    );
  };

  const modalTitle = () => {
    if (modalInfos?.type === "REPORT") return modalInfos?.title ?? "";

    if (modalInfos?.type === "LIST")
      return <Group justify="space-between">{modalInfos?.title ?? ""}</Group>;
  };

  return (
    <Stack h="100%">
      <Group justify="flex-end">
        <Button
          variant="light"
          radius={"xl"}
          leftSection={<ReportMoney />}
          onClick={() =>
            setModalInfos({
              opened: true,
              title: "Reportar transação manualmente",
              type: "REPORT",
            })
          }
        >
          Reportar manualmente
        </Button>
      </Group>

      <Table.ScrollContainer minWidth={"100%"}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ paddingLeft: "1rem" }}>
                Nome do cliente
              </Table.Th>
              <Table.Th>Saldo devedor</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data?.map((transaction, index) => (
              <Table.Tr key={index}>
                <Table.Td>{transaction?.name ?? "-"}</Table.Td>
                <Table.Td>
                  {formatCurrency(transaction?.negativeBalance ?? 0)}
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    onClick={() =>
                      setModalInfos({
                        opened: true,
                        title: `Histórico de transações - ${
                          transaction?.name ?? "-"
                        } | Saldo devedor atual: ${formatCurrency(
                          transaction?.negativeBalance ?? 0
                        )}`,
                        type: "LIST",
                        clientId: transaction?.id,
                      })
                    }
                  >
                    <Eye />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {!data?.length && <NoData />}
      <Modal
        size={modalInfos?.type === "LIST" ? "calc(100vw - 87px)" : "xl"}
        opened={Boolean(modalInfos?.opened)}
        onClose={() => setModalInfos(null)}
        centered
        title={modalTitle()}
        styles={{
          title: {
            fontWeight: 800,
            fontSize: "18px",
            width: "100%",
          },
        }}
      >
        {modalInfos?.type === "REPORT" && renderReportType()}
        {modalInfos?.type === "LIST" && renderListType()}
      </Modal>
    </Stack>
  );
}
