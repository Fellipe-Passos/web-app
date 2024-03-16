import {
  Button,
  Group,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
} from "@mantine/core";
import { ExpenseEnum } from "../../../../../types/expenses";
import { NumericFormat } from "react-number-format";
import { useForm, yupResolver } from "@mantine/form";
import { expanseSchema, expanseSchemaInitialValues } from "./schema";
import { useMutation } from "react-query";
import { AddExpense } from "./services/Create.service";
import { removeCurrencyMask } from "../../../../../utils";
import { notifications } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import { months } from "../services/index.service";

export default function CreateExpense() {
  const navigate = useNavigate();

  const form = useForm({
    validate: yupResolver(expanseSchema),
    initialValues: expanseSchemaInitialValues,
    validateInputOnChange: true,
  });

  const { mutate, isLoading } = useMutation(AddExpense);

  const onSubmit = () => {
    const { hasErrors } = form.validate();

    if (hasErrors) return;

    const dataToSend = {
      dueDay: form.values.dueDay,
      dueMonths: form.values.dueMonths,
      type: form.values.type as ExpenseEnum,
      value: removeCurrencyMask(form.values.value ?? ""),
      description: form.values.description,
    };

    mutate(dataToSend, {
      onSuccess() {
        notifications.show({
          title: "Despesa cadastrada",
          message: "A ação de cadastrar despesa foi concluída com sucesso!",
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
        navigate("/expenses");
      },
      onError(err: any) {
        notifications.show({
          title: "Falha ao cadastrar despesa",
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

  return (
    <Stack h={"100%"}>
      <Paper radius={"xl"} p={"xl"} shadow="xl" w={"70%"}>
        <SimpleGrid cols={3}>
          <TextInput label="Descrição" {...form.getInputProps("description")} />
          <Select
            label="Tipo de despesa"
            data={[
              { label: "Fixa", value: ExpenseEnum.FIXED_EXPENSES },
              { label: "Variável", value: ExpenseEnum.VARIABLE_EXPENSES },
            ]}
            {...form.getInputProps("type")}
          />
          <NumericFormat
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            customInput={TextInput}
            label="Valor"
            {...form.getInputProps("value")}
          />
        </SimpleGrid>

        <SimpleGrid cols={2}>
          <NumberInput
            label="Dia de vencimento"
            {...form.getInputProps("dueDay")}
          />
          <MultiSelect
            label="Meses de vencimento"
            data={months?.map((month) => ({
              label: month?.label,
              value: month?.value,
            }))}
            {...form.getInputProps("dueMonths")}
          />
        </SimpleGrid>
        <Group justify="space-between" mt={"lg"}>
          <Button
            loading={isLoading}
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>
          <Button loading={isLoading} onClick={onSubmit}>
            Salvar
          </Button>
        </Group>
      </Paper>
    </Stack>
  );
}
