// FinancialSection.tsx
import { Stack, Text } from "@mantine/core";
import React from "react";
import FinancialTable from "../FinancialTable";

interface FinancialSectionProps {
  title: string;
  data: any[];
}

const FinancialSection: React.FC<FinancialSectionProps> = ({ title, data }) => (
  <Stack h={"100%"}>
    <Text fz={"1.5rem"} fw={800} c="main">
      {title}
    </Text>

    <Stack>
      <FinancialTable clients={data} />
    </Stack>
  </Stack>
);

export default FinancialSection;
