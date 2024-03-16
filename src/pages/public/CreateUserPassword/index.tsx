import {
  Button,
  Group,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { PatternFormat } from "react-number-format";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import ErrorMessage from "../../../components/ErrorMessage";
import { removeCPFMask } from "../../../utils";
import { createPassword } from "./index.service";
import {
  CreatePasswordSchema,
  CreatePasswordSchemaInitialValues,
} from "./schema";

export default function CreateUserPassword(): JSX.Element {
  const navigate = useNavigate();
  const { isLoading, mutate, error } = useMutation(createPassword, {
    onSuccess: () => {
      navigate("/");
    },
  });

  const err = error as any;

  const form = useForm({
    validate: yupResolver(CreatePasswordSchema),
    initialValues: CreatePasswordSchemaInitialValues,
    validateInputOnChange: true,
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
    const { hasErrors } = form.validate();

    if (hasErrors) return;

    if (form.values.password === form.values.confirm) {
      const dataToSend = {
        login: removeCPFMask(form.values.login),
        password: form.values.password,
        confirmPassword: form.values.confirm,
      };

      mutate(dataToSend);
    }
  };

  return (
    <Group bg="main" h={"100vh"} w={"100vw"} justify="center" align="center">
      <Stack
        w={"40rem"}
        bg={"white"}
        style={{ borderRadius: "8px" }}
        py={"5rem"}
        px={"2rem"}
      >
        <form style={{ height: "100%" }} onSubmit={onSubmit}>
          <Stack justify="center" h={"100%"}>
            <Title order={1} c="main">
              Criar senha
            </Title>
            <Title order={6} c="gray">
              Insira seu CPF e crie sua senha.
            </Title>
            <PatternFormat
              format="###.###.###-##"
              customInput={TextInput}
              label="CPF"
              mask={"_"}
              placeholder="000.000.000-00"
              withAsterisk
              {...form.getInputProps("login")}
            />
            <PasswordInput
              withAsterisk
              label="Senha"
              {...form.getInputProps("password")}
            />
            <PasswordInput
              withAsterisk
              label="Confirme a senha"
              {...form.getInputProps("confirm")}
            />
            {Boolean(err) && <ErrorMessage text={err?.response?.data} />}
            <Button
              mt={"1.8rem"}
              variant="filled"
              fullWidth
              type="submit"
              loading={isLoading}
            >
              Criar senha
            </Button>
            <Button
              mt={"1.8rem"}
              variant="subtle"
              fullWidth
              onClick={() => navigate("/")}
              loading={isLoading}
            >
              Voltar
            </Button>
          </Stack>
        </form>
      </Stack>
    </Group>
  );
}
