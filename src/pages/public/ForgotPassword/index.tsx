import {
  Button,
  Divider,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <Stack>
      <Paper>
        <Title order={1}>Esqueceu a senha?</Title>
        <Title order={6}>Você receberá um código no email:</Title>
        <form>
          <TextInput label="Email" placeholder="name@email.com" />
          <Divider />
          <PasswordInput label="Código" placeholder="Ex 000000" />
          <PasswordInput label="Nova senha" />
          <PasswordInput label="Confirme senha" />
          <Button variant="filled" fullWidth>
            Redefinir senha
          </Button>
          <Button variant="outline" onClick={() => navigate("/")} fullWidth>
            Voltar
          </Button>
        </form>
      </Paper>
    </Stack>
  );
}
