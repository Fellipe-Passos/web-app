import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Table,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Check, Edit, Eye, X } from "tabler-icons-react";
import Loading from "../../../../../components/Loading";
import NoData from "../../../../../components/NoData";
import Tabs from "../../../../../components/Tabs";
import { ExpenseEnum } from "../../../../../types/expenses";
import { formatCurrency, removeCurrencyMask } from "../../../../../utils";
import { getMonthsByMonthValue } from "../services/index.service";
import { ListExpenses } from "./services/Get.service";
import { GetHistory } from "./services/History";
import { PayEmployee, PayExpense } from "./services/Pay.service";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { useForm, yupResolver } from "@mantine/form";
import {
  employeePaymentSchema,
  employeePaymentSchemaInitialValues,
} from "./schema/employeePayment";

export default function Expenses() {
  const navigate = useNavigate();
  const [opened, { close, open }] = useDisclosure();
  const [payOpened, { close: payClose, open: payOpen }] = useDisclosure();
  const [activeTab, setActiveTab] = useState<ExpenseEnum>(
    ExpenseEnum.FIXED_EXPENSES
  );
  const queryClient = useQueryClient();

  const {
    data: expenses,
    mutate: expensesMutate,
    isLoading: expensesIsLoading,
  } = useMutation(ListExpenses);

  console.log(expenses);

  const { mutate, isLoading } = useMutation(PayExpense);

  const { data: history, mutate: getHistory } = useMutation(GetHistory);

  const onPayExpense = (id: number) => {
    mutate(
      { expenseId: id },
      {
        onSuccess() {
          notifications.show({
            title: "Despesa paga",
            message: "A ação de pagar despesa foi concluída com sucesso!",
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
          queryClient.invalidateQueries(["expenses"]);
        },
        onError(err: any) {
          notifications.show({
            title: "Falha ao pagar despesa",
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
          queryClient.invalidateQueries(["expenses"]);
        },
      }
    );
  };

  useEffect(() => {
    expensesMutate({ type: activeTab });
  }, [activeTab]);

  const employeePaymentForm = useForm({
    validate: yupResolver(employeePaymentSchema),
    initialValues: employeePaymentSchemaInitialValues,
    validateInputOnChange: true,
  });

  const { mutate: payEmployeeMutate, isLoading: payEmployeeIsLoading } =
    useMutation(PayEmployee);

  const onPayEmployee = () => {
    const { hasErrors } = employeePaymentForm.validate();

    if (hasErrors) return;

    const dataToSend = {
      payrollId: Number(employeePaymentForm.values.payrollId),
      salaryAmount: removeCurrencyMask(
        employeePaymentForm.values.salaryAmount ?? ""
      ),
      commissionsAmount: employeePaymentForm.values.commissionsAmount
        ? removeCurrencyMask(employeePaymentForm.values.commissionsAmount)
        : null,
      userId: Number(employeePaymentForm.values.payrollId),
    };

    payEmployeeMutate(dataToSend, {
      onSuccess() {
        notifications.show({
          title: "Despesa paga",
          message: "A ação de pagar despesa foi concluída com sucesso!",
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
        employeePaymentForm.reset();
        payClose();
        expensesMutate({ type: activeTab });
      },
      onError(err: any) {
        notifications.show({
          title: "Falha ao pagar despesa",
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
        employeePaymentForm.reset();
        payClose();
        expensesMutate({ type: activeTab });
      },
    });
  };

  const renderEmployeeTable = () => {
    const employeePaymentsHistory = expenses?.flatMap((expense: any) => {
      return expense?.PayrollPaymentHistory?.filter(
        (h: any) => h?.payrollId === employeePaymentForm?.values.payrollId
      );
    });

    return (
      <Table striped withTableBorder withColumnBorders highlightOnHover>
        <Table.Thead>
          <Table.Th>Data do pagamento</Table.Th>
          <Table.Th>Valor do salário</Table.Th>
          <Table.Th>Valor da comissão</Table.Th>
          <Table.Th>Valor final</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {employeePaymentsHistory?.map((history: any, index: number) => (
            <Table.Tr key={index}>
              <Table.Td>
                {history?.paidAt
                  ? new Date(history?.paidAt)?.toLocaleDateString("pt-br")
                  : "-"}
              </Table.Td>
              <Table.Td>{formatCurrency(history?.salaryAmount ?? 0)}</Table.Td>
              <Table.Td>
                {formatCurrency(history?.commissionsAmount ?? 0)}
              </Table.Td>
              <Table.Td>
                {formatCurrency(
                  Number(history?.commissionsAmount ?? 0) +
                    Number(history?.salaryAmount ?? 0)
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    );
  };

  return (
    <Stack h={"100%"}>
      <Group justify="space-between">
        <div></div>
        <Tabs
          defaultValue={activeTab}
          onChange={async (e: ExpenseEnum) => {
            setActiveTab(e);
          }}
          tabs={[
            { label: "Despesas fixas", value: ExpenseEnum.FIXED_EXPENSES },
            {
              label: "Despesas variáveis",
              value: ExpenseEnum.VARIABLE_EXPENSES,
            },
            {
              label: "Funcionários",
              value: ExpenseEnum.EMPLOYEES,
            },
          ]}
        />
        <Group>
          <Button
            onClick={() => {
              if (activeTab !== ExpenseEnum.EMPLOYEES) {
                navigate("/create-expense");
              } else {
                navigate("/create-payroll");
              }
            }}
          >
            {activeTab !== ExpenseEnum.EMPLOYEES
              ? "Adicionar despesa"
              : "Adicionar à folha de pagamento"}
          </Button>
        </Group>
      </Group>
      {expenses?.length && !expensesIsLoading ? (
        <Table.ScrollContainer minWidth={"100%"}>
          {activeTab !== ExpenseEnum.EMPLOYEES && (
            <Table striped withTableBorder withColumnBorders highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Criado em</Table.Th>
                  <Table.Th>Conta</Table.Th>
                  <Table.Th>DIA de vencimento</Table.Th>
                  <Table.Th>Meses de vencimento</Table.Th>
                  <Table.Th>Valor</Table.Th>
                  <Table.Th>Último pagamento</Table.Th>
                  <Table.Th>Próximo pagamento</Table.Th>
                  <Table.Th>Disponível para pagamento</Table.Th>
                  <Table.Th>Ações</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {expenses?.map((expense: any, index: number) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      {expense?.createdAt
                        ? new Date(expense?.createdAt)?.toLocaleDateString(
                            "pt-br"
                          )
                        : "-"}
                    </Table.Td>
                    <Table.Td>{expense?.description ?? "-"}</Table.Td>
                    <Table.Td>{expense?.dueDay ?? "-"}</Table.Td>
                    <Table.Td>
                      {expense?.dueMonths
                        ? getMonthsByMonthValue(expense.dueMonths)
                        : "-"}
                    </Table.Td>
                    <Table.Td>{formatCurrency(expense?.value ?? 0)}</Table.Td>
                    <Table.Td>
                      {expense?.lastPaymentDate
                        ? new Date(
                            expense?.lastPaymentDate
                          )?.toLocaleDateString("pt-br")
                        : "-"}
                    </Table.Td>
                    <Table.Td>
                      {expense?.nextPaymentDate
                        ? new Date(
                            expense?.nextPaymentDate
                          )?.toLocaleDateString("pt-br")
                        : "-"}
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={expense?.nextPaymentReleased ? "green" : "red"}
                      >
                        {expense?.nextPaymentReleased ? "Sim" : "Não"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group>
                        {expense?.nextPaymentReleased && (
                          <Button
                            color="green"
                            loading={isLoading}
                            disabled={!expense?.nextPaymentReleased}
                            onClick={() => onPayExpense(expense.id)}
                          >
                            Pagar
                          </Button>
                        )}
                        <Tooltip label="Visualizar histórico de pagamento">
                          <ActionIcon
                            onClick={() => {
                              getHistory({ expenseId: expense.id });
                              open();
                            }}
                          >
                            <Eye />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Editar">
                          <ActionIcon color="cyan">
                            <Edit />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
          {activeTab === ExpenseEnum.EMPLOYEES && (
            <Table striped withTableBorder withColumnBorders highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Adicionado em</Table.Th>
                  <Table.Th>Funcionário</Table.Th>
                  <Table.Th>DIA de pagamento</Table.Th>
                  <Table.Th>Último pagamento</Table.Th>
                  <Table.Th>Próximo pagamento</Table.Th>
                  <Table.Th>Ações</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {expenses?.map((expense: any, index: number) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      {expense?.createdAt
                        ? new Date(expense?.createdAt)?.toLocaleDateString(
                            "pt-br"
                          )
                        : "-"}
                    </Table.Td>
                    <Table.Td>{expense?.user?.name ?? "-"}</Table.Td>
                    <Table.Td>{expense?.paymentDay ?? "-"}</Table.Td>
                    <Table.Td>
                      {expense?.lastPaymentDate
                        ? new Date(
                            expense?.lastPaymentDate
                          )?.toLocaleDateString("pt-br")
                        : "-"}
                    </Table.Td>
                    <Table.Td>
                      {expense?.nextPaymentDate
                        ? new Date(
                            expense?.nextPaymentDate
                          )?.toLocaleDateString("pt-br")
                        : "-"}
                    </Table.Td>
                    <Table.Td>
                      <Group>
                        <Button
                          color="green"
                          loading={isLoading}
                          onClick={() => {
                            employeePaymentForm.setFieldValue(
                              "payrollId",
                              expense.id
                            );
                            employeePaymentForm.setFieldValue(
                              "userId",
                              expense?.user?.id
                            );
                            payOpen();
                          }}
                        >
                          Pagar
                        </Button>
                        <Tooltip
                          label={
                            expense?.lastPaymentDate
                              ? "Visualizar histórico de pagamento"
                              : "Sem histórico para visualizar"
                          }
                        >
                          <ActionIcon
                            onClick={() => {
                              getHistory({ expenseId: expense.id });
                              employeePaymentForm.setFieldValue(
                                "payrollId",
                                expense.id
                              );
                              open();
                            }}
                            disabled={!expense?.lastPaymentDate}
                          >
                            <Eye />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Editar">
                          <ActionIcon color="cyan">
                            <Edit />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Table.ScrollContainer>
      ) : null}
      {expensesIsLoading && <Loading />}
      {!expenses?.length && !expensesIsLoading && <NoData />}
      <Modal
        size={"60vw"}
        opened={opened}
        onClose={close}
        centered
        title={<Group justify="space-between">Histórico de pagamentos</Group>}
        styles={{
          title: {
            fontWeight: 800,
            fontSize: "18px",
            width: "100%",
          },
        }}
      >
        <Table.ScrollContainer minWidth={"100%"}>
          {activeTab !== ExpenseEnum.EMPLOYEES && (
            <Table striped withTableBorder withColumnBorders highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>PAGO EM</Table.Th>
                  <Table.Th>DESCRIÇÃO</Table.Th>
                  <Table.Th>VALOR</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {history?.map((h: any, index: number) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      {h?.paidAt
                        ? new Date(h?.paidAt)?.toLocaleDateString("pt-br")
                        : "-"}
                    </Table.Td>
                    <Table.Td>{h?.expense?.description ?? "-"}</Table.Td>
                    <Table.Td>
                      {formatCurrency(h?.expense?.value ?? 0)}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
          {activeTab === ExpenseEnum.EMPLOYEES && renderEmployeeTable()}
        </Table.ScrollContainer>
      </Modal>

      <Modal
        size={"30vw"}
        opened={payOpened}
        onClose={payClose}
        centered
        title={"Reportar pagamento de funcionário"}
        styles={{
          title: {
            fontWeight: 800,
            fontSize: "18px",
            width: "100%",
          },
        }}
      >
        <Stack>
          <SimpleGrid cols={2}>
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              customInput={TextInput}
              withAsterisk
              label="Valor do salário"
              {...employeePaymentForm.getInputProps("salaryAmount")}
            />
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              customInput={TextInput}
              label="Valor da comissão (Opcional)"
              {...employeePaymentForm.getInputProps("commissionsAmount")}
            />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <Button
              loading={payEmployeeIsLoading}
              variant="outline"
              onClick={payClose}
            >
              Cancelar
            </Button>
            <Button loading={payEmployeeIsLoading} onClick={onPayEmployee}>
              Salvar
            </Button>
          </SimpleGrid>
        </Stack>
      </Modal>
    </Stack>
  );
}
