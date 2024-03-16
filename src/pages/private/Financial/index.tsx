// Financial.tsx
import { SimpleGrid, Stack } from "@mantine/core";
import React from "react";
import { useQuery } from "react-query";
import FinancialSection from "./components/FinancialSection";
import { getFinancial } from "./index.service";

const Financial: React.FC = () => {
  const { data } = useQuery("financial", getFinancial);

  return (
    <Stack h={"100%"}>
      <SimpleGrid cols={3}>
        <FinancialSection title="A receber" data={data?.pendingPayment} />
        <FinancialSection title="Recebidos hoje" data={data?.finishedToday} />
        <FinancialSection title="Recebidos mês" data={data?.finishedMonthly} />
      </SimpleGrid>
    </Stack>
  );
};

export default Financial;
