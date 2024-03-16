// FinancialEntry.tsx
import React from "react";
import { Divider, Group, Text } from "@mantine/core";
import { formatCurrency } from "../../../../../utils";

interface FinancialEntryProps {
  title: string;
  amount: number;
}

const FinancialEntry: React.FC<FinancialEntryProps> = ({ title, amount }) => (
  <Group
    justify="space-between"
    style={(theme) => ({
      border: `2px solid ${theme.colors.orange[6]}`,
      gap: 0,
      borderRadius: "10px",
      padding: ".5rem 1rem",
    })}
  >
    <Text fz={"1.15rem"} fw={700}>
      {title}
    </Text>
    <Divider />
    <Group justify="flex-end">
      <Text fz={"1.5rem"} fw={800} c="teal">
        {formatCurrency(amount)}
      </Text>
    </Group>
  </Group>
);

export default FinancialEntry;
