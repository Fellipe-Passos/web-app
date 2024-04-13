import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Stack,
  Table,
  Tooltip,
} from "@mantine/core";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash, UserPlus } from "tabler-icons-react";
import NoData from "../../../../components/NoData";
import { formatCurrency } from "../../../../utils";
import { listServices } from "./index.service";

export default function ServicesDashboard(): JSX.Element {
  const { data } = useQuery("view-services", listServices);
  const navigate = useNavigate();

  return (
    <Stack h={"100%"}>
      <Group justify="flex-end">
        <Button
          variant="light"
          radius={"xl"}
          leftSection={<UserPlus />}
          onClick={() => navigate("/services")}
        >
          Adicionar novo serviço
        </Button>
      </Group>

      <Table.ScrollContainer minWidth={"100%"}>
        <Table striped withTableBorder withColumnBorders highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ paddingLeft: "1rem" }}>Nome</Table.Th>
              <Table.Th>Preço</Table.Th>
              <Table.Th>Item comissionado?</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data?.map((user, index) => (
              <Table.Tr key={index}>
                <Table.Td style={{ paddingLeft: "1rem" }}>
                  {user?.name ?? "-"}
                </Table.Td>
                <Table.Td>{formatCurrency(user?.price)}</Table.Td>
                <Table.Td>
                  <Badge color={user?.commissionedItem ? "teal" : "red"}>
                    {user?.commissionedItem ? "Sim" : "Não"}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group>
                    <Tooltip label="Editar">
                      <ActionIcon
                        color="blue"
                        radius={"xl"}
                        onClick={() => navigate(`/edit-service/${user?.id}`)}
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
