import {
  Button,
  Group,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
} from "@mantine/core";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import {
  User,
  getUsersToSelect,
} from "../../../Orders/NewOrder/services/users.service";
import { getUsers } from "../../../Reports/index.service";
import { AddPayroll } from "./index.service";
import { useForm, yupResolver } from "@mantine/form";
import { payrollSchema, payrollSchemaInitialValues } from "./schema";
import { notifications } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";

export default function CreatePayroll() {
  const navigate = useNavigate();

  const { data: userData } = useQuery("user-by-role", () => getUsers());

  const { mutate, isLoading } = useMutation(AddPayroll);

  const form = useForm({
    validate: yupResolver(payrollSchema),
    initialValues: payrollSchemaInitialValues,
    validateInputOnChange: true,
  });

  const onSubmit = () => {
    const { hasErrors, errors } = form.validate();
    console.log(errors);

    if (hasErrors) return;

    const dataToSend = {
      paymentDay: form.values.paymentDay,
      userId: Number(form.values.userId),
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
        <SimpleGrid cols={2}>
          <Select
            clearable
            searchable
            data={getUsersToSelect(userData as User[])}
            label="Colaborador (Opcional)"
            {...form.getInputProps("userId")}
          />
          <NumberInput
            label="Dia de pagamento"
            {...form.getInputProps("paymentDay")}
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
