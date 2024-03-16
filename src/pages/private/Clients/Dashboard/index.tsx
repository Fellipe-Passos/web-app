import {
  ActionIcon,
  Button,
  Group,
  Stack,
  Table,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Pencil, Search, Trash, UserPlus } from "tabler-icons-react";

import NoData from "../../../../components/NoData";
import { UserRoles } from "../../../../types/user";
import { humanizeCellphone } from "../../../../utils";
import { getUserRole } from "../../../../utils/userToken";
import { listClients } from "./index.service";

export default function ClientsDashboard() {
  const navigate = useNavigate();
  const { data, mutate } = useMutation(listClients);
  const userRole = getUserRole();

  useEffect(() => {
    mutate(undefined);
  }, []);

  return (
    <Stack h={"100%"}>
      <Group justify="space-between">
        <Group>
          <TextInput
            placeholder="Buscar por Nome, CRO e Telefone"
            leftSection={<Search />}
            onChange={(e) => {
              if (e.currentTarget.value?.length) {
                mutate(e.currentTarget.value);
              } else {
                mutate(undefined);
              }
            }}
          />
        </Group>
        {[
          UserRoles.Manager,
          UserRoles.Administration,
          UserRoles.Ceo,
          UserRoles.Root,
        ]?.includes(userRole as UserRoles) && (
          <Button
            leftSection={<UserPlus />}
            onClick={() => navigate("/add-client")}
          >
            Adicionar novo cliente
          </Button>
        )}
      </Group>

      <Table.ScrollContainer minWidth={"100%"}>
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Id Cliente</Table.Th>
              <Table.Th>Nome</Table.Th>
              <Table.Th>Telefone</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data?.map((user, index) => (
              <Table.Tr key={index}>
                <Table.Td>{user?.id ?? "-"}</Table.Td>
                <Table.Td>{user?.name ?? "-"}</Table.Td>
                <Table.Td>
                  {humanizeCellphone(user?.phone?.replace("5582", "829"))}
                </Table.Td>
                <Table.Td>
                  <Group>
                    <Tooltip label="Editar">
                      <ActionIcon
                        color="blue"
                        radius={"xl"}
                        onClick={() => navigate(`/edit-client/${user?.id}`)}
                      >
                        <Pencil />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Excluir">
                      <ActionIcon>
                        <Trash />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
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
