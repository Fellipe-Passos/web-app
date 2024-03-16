import { Button, Divider, Group, Select, Stack, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, yupResolver } from "@mantine/form";
import { useState } from "react";
import { useQuery } from "react-query";

import baseURL from "../../../config/api/baseURL";
import { UserRoles } from "../../../types/user";
import { getUserRole } from "../../../utils/userToken";
import {
  getClientsToSelect,
  listClients,
} from "../Orders/NewOrder/services/clients.service";
import { getServicesToSelect } from "../Orders/NewOrder/services/services.service";
import {
  User,
  getUsersToSelect,
} from "../Orders/NewOrder/services/users.service";
import { listServices } from "../Services/Dashboard/index.service";
import { getMaterialsToSelect, getUsers, listMaterials } from "./index.service";
import {
  financialSchema,
  financialSchemaInitialValues,
} from "./schema/financial";
import {
  inventorySchema,
  inventorySchemaInitialValues,
} from "./schema/inventory";
import {
  productionSchema,
  productionSchemaInitialValues,
} from "./schema/production";
import { serviceSchema, serviceSchemaInitialValues } from "./schema/services";
import { transactionSchema } from "../Transactions/Dashboard/schema";
import { transactionsSchemaInitialValues } from "./schema/transactions";

export default function Reports(): JSX.Element {
  const [loading, setIsLoading] = useState(false);
  const userRole = getUserRole();

  const { data: userData } = useQuery("user-by-role", () => getUsers());
  const { data: clientsData } = useQuery("list-clients", listClients);
  const { data: servicesData } = useQuery("view-services", listServices);

  const { data: materialsData } = useQuery("list-materials", listMaterials);

  const users = userData?.filter(
    (user) =>
      ![
        UserRoles.Administration,
        UserRoles.ScreeningAdministration,
        UserRoles.Ceo,
        UserRoles.Manager,
        UserRoles.Root,
      ]?.includes(user?.role as UserRoles)
  );

  const productionForm = useForm({
    validate: yupResolver(productionSchema),
    initialValues: productionSchemaInitialValues,
    validateInputOnChange: true,
  });

  const financialForm = useForm({
    validate: yupResolver(financialSchema),
    initialValues: financialSchemaInitialValues,
    validateInputOnChange: true,
  });

  const serviceForm = useForm({
    validate: yupResolver(serviceSchema),
    initialValues: serviceSchemaInitialValues,
    validateInputOnChange: true,
  });

  const inventoryForm = useForm({
    validate: yupResolver(inventorySchema),
    initialValues: inventorySchemaInitialValues,
    validateInputOnChange: true,
  });

  const transactionsForm = useForm({
    validate: yupResolver(transactionSchema),
    initialValues: transactionsSchemaInitialValues,
    validateInputOnChange: true,
  });

  const emitProductionForm = async () => {
    const dataToSend = {
      userId: productionForm.values.userId
        ? Number(productionForm.values.userId)
        : null,
      startDate: productionForm.values.startDate,
      endDate: productionForm.values.finalDate,
    };

    try {
      setIsLoading(true);

      fetch(`${baseURL.baseURLDev}/production-report`, {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: {
          "Content-Type": "application/json", // Define o tipo de conteúdo no cabeçalho da requisição.
        },
      })
        .then((response) => response.blob()) // Obtém a resposta como um blob.
        .then((blob) => {
          const fileURL = URL.createObjectURL(blob);
          setIsLoading(false);
          window.open(fileURL, "_blank");
        })
        .catch((error) => {
          // Lida com qualquer erro ocorrido durante o fetch.
          setIsLoading(false);
          console.error("Erro durante o fetch:", error);
        });
    } catch (error) {
      setIsLoading(false);

      console.error(error);
    }
  };

  const emitFinancialForm = async () => {
    const dataToSend = {
      clientId: financialForm.values.clientId
        ? Number(financialForm.values.clientId)
        : null,
      startDate: financialForm.values.startDate,
      endDate: financialForm.values.finalDate,
    };

    try {
      setIsLoading(true);

      fetch(`${baseURL.baseURLDev}/financial-report`, {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: {
          "Content-Type": "application/json", // Define o tipo de conteúdo no cabeçalho da requisição.
        },
      })
        .then((response) => response.blob()) // Obtém a resposta como um blob.
        .then((blob) => {
          const fileURL = URL.createObjectURL(blob);
          setIsLoading(false);
          window.open(fileURL, "_blank");
        })
        .catch((error) => {
          // Lida com qualquer erro ocorrido durante o fetch.
          setIsLoading(false);
          console.error("Erro durante o fetch:", error);
        });
    } catch (error) {
      setIsLoading(false);

      console.error(error);
    }
  };

  const emitServiceForm = async () => {
    const dataToSend = {
      serviceId: serviceForm.values.serviceId
        ? Number(serviceForm.values.serviceId)
        : null,
      startDate: serviceForm.values.startDate,
      endDate: serviceForm.values.finalDate,
    };

    try {
      setIsLoading(true);

      fetch(`${baseURL.baseURLDev}/services-report`, {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: {
          "Content-Type": "application/json", // Define o tipo de conteúdo no cabeçalho da requisição.
        },
      })
        .then((response) => response.blob()) // Obtém a resposta como um blob.
        .then((blob) => {
          const fileURL = URL.createObjectURL(blob);
          setIsLoading(false);
          window.open(fileURL, "_blank");
        })
        .catch((error) => {
          // Lida com qualquer erro ocorrido durante o fetch.
          setIsLoading(false);
          console.error("Erro durante o fetch:", error);
        });
    } catch (error) {
      setIsLoading(false);

      console.error(error);
    }
  };

  const emitInventoryForm = async () => {
    const dataToSend = {
      productId: inventoryForm.values.product
        ? Number(inventoryForm.values.product)
        : null,
      table: inventoryForm?.values?.table ? inventoryForm?.values.table : null,
      startDate: inventoryForm.values.startDate,
      endDate: inventoryForm.values.finalDate,
    };

    try {
      setIsLoading(true);

      fetch(`${baseURL.baseURLDev}/inventory-report`, {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: {
          "Content-Type": "application/json", // Define o tipo de conteúdo no cabeçalho da requisição.
        },
      })
        .then((response) => response.blob()) // Obtém a resposta como um blob.
        .then((blob) => {
          const fileURL = URL.createObjectURL(blob);
          setIsLoading(false);
          window.open(fileURL, "_blank");
        })
        .catch((error) => {
          // Lida com qualquer erro ocorrido durante o fetch.
          setIsLoading(false);
          console.error("Erro durante o fetch:", error);
        });
    } catch (error) {
      setIsLoading(false);

      console.error(error);
    }
  };

  const emitTransactionsReport = async () => {
    const dataToSend = {
      clientId: transactionsForm.values.clientId
        ? Number(transactionsForm.values.clientId)
        : null,
      startDate: transactionsForm.values.startDate,
      endDate: transactionsForm.values.finalDate,
    };

    try {
      setIsLoading(true);

      fetch(`${baseURL.baseURLDev}/transactions-report`, {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: {
          "Content-Type": "application/json", // Define o tipo de conteúdo no cabeçalho da requisição.
        },
      })
        .then((response) => response.blob()) // Obtém a resposta como um blob.
        .then((blob) => {
          const fileURL = URL.createObjectURL(blob);
          setIsLoading(false);
          window.open(fileURL, "_blank");
        })
        .catch((error) => {
          // Lida com qualquer erro ocorrido durante o fetch.
          setIsLoading(false);
          console.error("Erro durante o fetch:", error);
        });
    } catch (error) {
      setIsLoading(false);

      console.error(error);
    }
  };

  return (
    <Stack h={"100%"}>
      {[UserRoles.Ceo, UserRoles.Root]?.includes(userRole as UserRoles) && (
        <>
          <Stack>
            <Text>Emitir relatório de produção</Text>
            <Group align="end">
              <DateInput
                valueFormat="DD/MM/YYYY"
                locale="pt-BR"
                clearable
                withAsterisk
                label="Data de início"
                {...productionForm.getInputProps("startDate")}
              />
              <DateInput
                valueFormat="DD/MM/YYYY"
                locale="pt-BR"
                clearable
                withAsterisk
                label="Data final"
                {...productionForm.getInputProps("finalDate")}
              />
              <Select
                clearable
                searchable
                data={getUsersToSelect(users as User[])}
                {...productionForm.getInputProps("userId")}
                label="Colaborador (Opcional)"
              />
              <Button
                w={"10rem"}
                onClick={emitProductionForm}
                loading={loading}
              >
                Emitir
              </Button>
            </Group>
          </Stack>

          <Divider />

          <Stack>
            <Text>Emitir relatório financeiro</Text>
            <Group align="end">
              <DateInput
                valueFormat="DD/MM/YYYY"
                locale="pt-BR"
                clearable
                withAsterisk
                label="Data de início"
                {...financialForm.getInputProps("startDate")}
              />
              <DateInput
                valueFormat="DD/MM/YYYY"
                locale="pt-BR"
                clearable
                withAsterisk
                label="Data final"
                {...financialForm.getInputProps("finalDate")}
              />
              <Select
                clearable
                searchable
                data={getClientsToSelect(clientsData)}
                {...financialForm.getInputProps("clientId")}
                label="Cliente (Opcional)"
              />
              <Button w={"10rem"} onClick={emitFinancialForm} loading={loading}>
                Emitir
              </Button>
            </Group>
          </Stack>

          <Divider />
        </>
      )}

      <Stack>
        <Text>Emitir relatório de serviços</Text>
        <Group align="end">
          <DateInput
            valueFormat="DD/MM/YYYY"
            locale="pt-BR"
            clearable
            withAsterisk
            label="Data de início"
            {...serviceForm.getInputProps("startDate")}
          />
          <DateInput
            valueFormat="DD/MM/YYYY"
            locale="pt-BR"
            clearable
            withAsterisk
            label="Data final"
            {...serviceForm.getInputProps("finalDate")}
          />
          <Select
            clearable
            searchable
            data={getServicesToSelect(servicesData)}
            {...serviceForm.getInputProps("serviceId")}
            label="Serviço (Opcional)"
          />
          <Button w={"10rem"} onClick={emitServiceForm} loading={loading}>
            Emitir
          </Button>
        </Group>
      </Stack>

      <Divider />

      <Stack>
        <Text>Emitir relatório de estoque</Text>
        <Group align="end">
          <DateInput
            valueFormat="DD/MM/YYYY"
            locale="pt-BR"
            clearable
            withAsterisk
            label="Data de início"
            {...inventoryForm.getInputProps("startDate")}
          />
          <DateInput
            valueFormat="DD/MM/YYYY"
            locale="pt-BR"
            clearable
            withAsterisk
            label="Data final"
            {...inventoryForm.getInputProps("finalDate")}
          />
          <Select
            clearable
            searchable
            data={getMaterialsToSelect(materialsData)}
            {...inventoryForm.getInputProps("product")}
            label="Produto (Opcional)"
          />
          <Select
            clearable
            searchable
            data={[
              { label: "Insumos", value: "INPUTS" },
              { label: "Matérias-prima", value: "RAW_MATERIALS" },
            ]}
            {...inventoryForm.getInputProps("table")}
            label="Tabela (Opcional)"
          />
          <Button w={"10rem"} onClick={emitInventoryForm} loading={loading}>
            Emitir
          </Button>
        </Group>
      </Stack>

      <Divider />

      <Stack>
        <Text>Emitir relatório de movimentação de caixa</Text>
        <Group align="end">
          <DateInput
            valueFormat="DD/MM/YYYY"
            locale="pt-BR"
            clearable
            withAsterisk
            label="Data de início"
            {...transactionsForm.getInputProps("startDate")}
          />
          <DateInput
            valueFormat="DD/MM/YYYY"
            locale="pt-BR"
            clearable
            withAsterisk
            label="Data final"
            {...transactionsForm.getInputProps("finalDate")}
          />
          <Select
            clearable
            searchable
            data={getClientsToSelect(clientsData)}
            {...transactionsForm.getInputProps("clientId")}
            label="Cliente (Opcional)"
          />
          <Button
            w={"10rem"}
            onClick={emitTransactionsReport}
            loading={loading}
          >
            Emitir
          </Button>
        </Group>
      </Stack>
    </Stack>
  );
}
