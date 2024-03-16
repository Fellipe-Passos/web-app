import {
  ActionIcon,
  Button,
  Group,
  Stack,
  Table,
  Tooltip,
} from "@mantine/core";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { Trash, UserPlus } from "tabler-icons-react";

import NoData from "../../../../components/NoData";
import { UserRoles } from "../../../../types/user";
import { humanizeCPF } from "../../../../utils";
import { listUsers, translateRole } from "./index.service";

export default function ViewUsers(): JSX.Element {
  const { data } = useQuery("view-users", listUsers);
  const navigate = useNavigate();

  return (
    <Stack h={"100%"}>
      <Group justify="flex-end">
        <Button
          leftSection={<UserPlus />}
          onClick={() => navigate("/add-user")}
        >
          Adicionar novo usuário
        </Button>
      </Group>

      <Table.ScrollContainer minWidth={"100%"}>
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>CPF</Table.Th>
              <Table.Th>Nome</Table.Th>
              <Table.Th>Setor</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data?.map((user, index) => (
              <Table.Tr key={index}>
                <Table.Td>{humanizeCPF(user?.CPF)}</Table.Td>
                <Table.Td>{user?.name}</Table.Td>
                <Table.Td>
                  {translateRole(user?.role as UserRoles | undefined)}
                </Table.Td>
                <Table.Td>
                  <Tooltip label="Excluir">
                    <ActionIcon>
                      <Trash />
                    </ActionIcon>
                  </Tooltip>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {!data?.length && <NoData />}
    </Stack>
  );
}
