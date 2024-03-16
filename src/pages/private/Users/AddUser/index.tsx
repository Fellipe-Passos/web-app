import {
  Box,
  Button,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { PatternFormat } from "react-number-format";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Check, X } from "tabler-icons-react";

import { createUser, getRolesToSelect } from "./index.service";
import { userSchema, userSchemaInitialValues } from "./schema";
import { removeCPFMask } from "../../../../utils";
import { UserRoles } from "../../../../types/user";

export default function AddUser(): JSX.Element {
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation(createUser);

  const form = useForm({
    validate: yupResolver(userSchema),
    initialValues: userSchemaInitialValues,
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  const onSubmit = (): void => {
    const { hasErrors } = form.validate();

    if (hasErrors) return;

    const dataToSend = {
      name: form.values.name,
      CPF: removeCPFMask(form.values.CPF),
      role: form.values.role as UserRoles,
    };

    mutate(dataToSend, {
      onSuccess() {
        notifications.show({
          title: "Usuário cadastrado",
          message: "A ação de cadastrar usuário foi concluída com sucesso!",
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
        navigate("/home");
      },
      onError(err: any) {
        notifications.show({
          title: "Falha ao cadastrar usuário",
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
    <Stack>
      <Box style={{ padding: "1.5rem 2rem" }}>
        <Stack w={"60%"} mt={"4rem"} style={{ gap: "1.5rem" }}>
          <TextInput label="Nome completo" {...form.getInputProps("name")} />
          <SimpleGrid cols={2}>
            <PatternFormat
              format="###.###.###-##"
              customInput={TextInput}
              label="CPF"
              mask={"_"}
              {...form.getInputProps("CPF")}
            />
            <Select
              label="Setor"
              data={getRolesToSelect()}
              clearable
              {...form.getInputProps("role")}
            />
          </SimpleGrid>
          <SimpleGrid cols={2} mt={"2rem"}>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              loading={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={onSubmit} loading={isLoading}>
              Salvar
            </Button>
          </SimpleGrid>
        </Stack>
      </Box>
    </Stack>
  );
}
