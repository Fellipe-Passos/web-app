import {
  Button,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { PatternFormat } from "react-number-format";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../../components/ErrorMessage";
import { login, loginSuccess } from "./Login.service";
import { LoginSchema, LoginSchemaInitialValues } from "./schema";
import { removeCPFMask } from "../../../utils";

export default function Login() {
  const navigate = useNavigate();
  const { isLoading, mutate, error } = useMutation(login, {
    onSuccess: (data) => {
      loginSuccess(data);
      navigate("/view-orders");
    },
  });

  const err = error as any;

  const form = useForm({
    validate: yupResolver(LoginSchema),
    initialValues: LoginSchemaInitialValues,
    validateInputOnChange: true,
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
    const { hasErrors } = form.validate();

    if (hasErrors) return;

    const dataToSend = {
      login: removeCPFMask(form.values.login),
      password: form.values.password,
    };

    mutate(dataToSend);
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
            <Title c={"main"}>Login</Title>
            <Text fz={".9rem"} c="gray">
              Entre com seu CPF e senha. Caso seja seu primeiro acesso, você
              precisa criar uma senha na opção "Primeiro acesso".
            </Text>
            <PatternFormat
              format="###.###.###-##"
              customInput={TextInput}
              label="CPF"
              mask={"_"}
              withAsterisk
              placeholder="000.000.000-00"
              {...form.getInputProps("login")}
            />
            <PasswordInput
              label="Senha"
              withAsterisk
              {...form.getInputProps("password")}
            />
            {Boolean(err) && <ErrorMessage text={err?.response?.data} />}
            <Button
              mt={"1.8rem"}
              variant="filled"
              fullWidth
              type="submit"
              // onClick={onSubmit}
              loading={isLoading}
            >
              Entrar
            </Button>
            <Button
              mt={"1.8rem"}
              variant="subtle"
              fullWidth
              onClick={() => navigate("/create-password")}
              loading={isLoading}
            >
              Primeiro acesso? Clique aqui!
            </Button>
          </Stack>
        </form>
      </Stack>
    </Group>
  );
}

{
  /* <Stack justify="center" align="center">
<Stack w={"40%"} h={"60%"}>
  <form style={{ height: "100%" }}>
    <Stack justify="center" h={"100%"}>
      <Title c={"main"}>Login</Title>
      <PatternFormat
        format="###.###.###-##"
        customInput={TextInput}
        label="CPF"
        mask={"_"}
        withAsterisk
        {...form.getInputProps("login")}
      />
      <PasswordInput
        label="Senha"
        withAsterisk
        {...form.getInputProps("password")}
      />
      {Boolean(err) && <ErrorMessage text={err?.response?.data} />}
      <Button
        mt={"1.8rem"}
        variant="filled"
        fullWidth
        onClick={onSubmit}
        loading={isLoading}
      >
        Entrar
      </Button>
      <Button
        mt={"1.8rem"}
        variant="subtle"
        fullWidth
        onClick={() => navigate("/create-password")}
        loading={isLoading}
      >
        Primeiro acesso? Clique aqui!
      </Button>
    </Stack>
  </form>
</Stack>
</Stack> */
}
