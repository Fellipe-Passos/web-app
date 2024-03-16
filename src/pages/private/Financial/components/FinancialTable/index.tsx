import { Box, Group, Table, Text } from "@mantine/core";
import React from "react";
import { formatCurrency } from "../../../../../utils";
import NoData from "../../../../../components/NoData";

interface FinancialTableProps {
  clients: any;
}

const FinancialTable: React.FC<FinancialTableProps> = ({ clients }) => (
  <Box style={{ boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.59)" }}>
    <Box
      style={{
        borderRadius: "16px 16px 0 0",
      }}
      h="100%"
    >
      {Boolean(clients?.table?.length) && (
        <Table.ScrollContainer minWidth={"100%"} h={"59vh"} mah={"59vh"}>
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Cliente</Table.Th>
                <Table.Th>ID Pedido</Table.Th>
                <Table.Th>Valor</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {clients?.table?.map((client: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td>{client?.client ?? 0}</Table.Td>
                  <Table.Td>{client?.order ?? "-"}</Table.Td>
                  <Table.Td>{formatCurrency(client?.price ?? 0)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
      {!clients?.table?.length && (
        <Group justify="center" align="center" h={"40vh"}>
          <NoData />
        </Group>
      )}
      <Box pt={".4rem"} pb={".4rem"}>
        <Group
          justify="space-between"
          style={{ borderTop: "1px solid grey" }}
          pl={"1rem"}
          pr={"1rem"}
        >
          <Text fz={"1rem"} fw={800}>
            Total
          </Text>
          <Text fz={"1rem"} fw={800} c="teal">
            {formatCurrency(clients?.total ?? 0)}
          </Text>
        </Group>
      </Box>
    </Box>
  </Box>
);

export default FinancialTable;
