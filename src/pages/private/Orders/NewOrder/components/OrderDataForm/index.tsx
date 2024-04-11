import {
  ActionIcon,
  Box,
  Button,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Table,
  TextInput,
  Textarea,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Trash } from "tabler-icons-react";
import NoData from "../../../../../../components/NoData";
import { orderSchemaInitialValues } from "../../schema";
import {
  getClientsToSelect,
  listClients,
} from "../../services/clients.service";
import {
  getMaterialsToSelect,
  listMaterials,
} from "../../services/products.service";
import {
  colors,
  dent,
  materialsSendedToClient,
} from "../../services/selects.service";
import {
  getServicesToSelect,
  listServices,
} from "../../services/services.service";

interface OrderDataFormProps {
  orderData: any;
  form: UseFormReturnType<any>;
}

export default function OrderDataForm({
  orderData,
  form,
}: OrderDataFormProps): JSX.Element {
  const { orderId } = useParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    let materialsSendedByClient = undefined;

    if (orderData?.materialsSendedByClient) {
      if (typeof orderData?.materialsSendedByClient === "string") {
        materialsSendedByClient =
          orderData?.materialsSendedByClient?.split(", ");
      } else {
        materialsSendedByClient = orderData?.materialsSendedByClient;
      }
    }

    if (orderData && orderId) {
      form.setValues({
        clientId: orderData?.clientId?.toString() ?? "0",
        patientName: orderData?.patientName ?? "",
        color: orderData?.color,
        laboratoryColor: orderData?.laboratoryColor,
        materialsSendedByClient,
        observations: orderData?.observations ?? "",
        services: orderData?.services?.length
          ? orderData?.services?.map((service: any) => ({
              id: service?.id,
              amount: service?.amount,
              serviceId: service?.serviceId,
              dent:
                typeof service?.dent === "string"
                  ? service?.dent?.split(", ")
                  : service?.dent,
            }))
          : [],
        products: orderData?.products ?? [],
      });
    }
  }, [orderData]);

  const { data: clientsData } = useQuery("list-clients", listClients);
  const { data: materialsData } = useQuery("list-materials", () =>
    listMaterials()
  );

  useEffect(() => {
    if (form.values.clientId) {
      listMaterials(form.values.clientId).then((data) => {
        queryClient.setQueryData("list-materials", data);
      });
    }
  }, [form.values.clientId]);

  const { data: servicesData } = useQuery("list-services", listServices);

  const getSelectedService = (value: number) => {
    const service = servicesData?.find((s) => Number(s?.id) === Number(value));

    return service?.name ?? "-";
  };

  const getSelectedProduct = (value: number) => {
    for (const material of materialsData ?? []) {
      const product = material?.products?.find(
        (p: any) => Number(p.id) === Number(value)
      );
      if (product) {
        return product.name;
      }
    }
    return "-";
  };

  const addService = (): void => {
    const { currentService } = form.values;

    const materialList = form.values.services;

    // Clone the initial material schema to avoid modifying it directly
    const initialMaterial = [...orderSchemaInitialValues.services];

    // Insert a new item into the material list
    form.insertListItem("services", initialMaterial[0]);

    // Set the currentService for the newly added item
    const newMaterialIndex = materialList.length;
    form.setFieldValue(`services.${newMaterialIndex}`, currentService);
    form.setFieldValue("currentService", {
      serviceId: "",
      dent: [],
      amount: "",
    });
  };

  const addProduct = (): void => {
    const { currentProduct } = form.values;

    const productList = form.values.products;

    // Clone the initial material schema to avoid modifying it directly
    const initialProduct = [...orderSchemaInitialValues.products];

    // Insert a new item into the material list
    form.insertListItem("products", initialProduct[0]);

    // Set the currentService for the newly added item
    const newMaterialIndex = productList.length;
    form.setFieldValue(`products.${newMaterialIndex}`, currentProduct);
    form.setFieldValue("currentProduct", {
      amount: "",
      productId: "",
    });
  };

  const renderForm = () => {
    return (
      <Stack h={"100%"} justify="center" style={{ gap: 0 }}>
        <SimpleGrid cols={2}>
          <Select
            searchable
            clearable
            data={getClientsToSelect(clientsData)}
            disabled={!clientsData}
            label="Cliente"
            placeholder="Selecione o cliente"
            {...form.getInputProps("clientId")}
          />
          <TextInput
            label="Nome do paciente"
            placeholder="Digite o nome do paciente"
            {...form.getInputProps("patientName")}
          />

          <Select
            searchable
            data={colors}
            disabled={!clientsData}
            label="Cor"
            clearable
            placeholder="Selecione a cor"
            {...form.getInputProps("color")}
          />
          <TextInput
            disabled={!clientsData}
            label="Cor laboratório (Pastilha, bloco)"
            placeholder="Digite a cor"
            {...form.getInputProps("laboratoryColor")}
          />
        </SimpleGrid>
        <MultiSelect
          data={materialsSendedToClient}
          clearable
          searchable
          label="Materiais enviados (cliente)"
          placeholder="Selecione os materiais enviados"
          styles={{
            input: {
              height: "4rem",
              maxHeight: "4rem",
            },
          }}
          {...form.getInputProps("materialsSendedByClient")}
        />
        <Textarea
          label="Observações"
          styles={{
            input: {
              height: "6rem",
              maxHeight: "6rem",
            },
          }}
          {...form.getInputProps("observations")}
        />
        <SimpleGrid cols={4}>
          <Select
            data={getServicesToSelect(servicesData)}
            label="Serviço"
            placeholder="Selecione o serviço"
            clearable
            disabled={!materialsData}
            {...form.getInputProps(`currentService.serviceId`)}
          />
          <MultiSelect
            label="Dentes"
            data={dent}
            clearable
            searchable
            styles={{
              input: {
                maxHeight: "38px",
                overflow: "auto",
              },
            }}
            {...form.getInputProps("currentService.dent")}
          />
          <NumberInput
            label="Qtd"
            {...form.getInputProps("currentService.amount")}
          />
          <Group h={"100%"} align="end">
            <Button variant="light" onClick={addService}>
              Ok
            </Button>
          </Group>
        </SimpleGrid>
        <SimpleGrid cols={3}>
          <Select
            data={getMaterialsToSelect(materialsData)}
            label="Produto"
            placeholder="Selecione o produto"
            clearable
            disabled={!materialsData}
            {...form.getInputProps("currentProduct.productId")}
          />
          <NumberInput
            label="Qtd"
            {...form.getInputProps("currentProduct.amount")}
          />
          <Group h={"100%"} align="end">
            <Button variant="light" onClick={addProduct}>
              Ok
            </Button>
          </Group>
        </SimpleGrid>
      </Stack>
    );
  };

  const renderTables = () => {
    return (
      <Stack h={"100%"} justify="center">
        <Table.ScrollContainer minWidth={"100%"} h={"32vh"} mah={"32vh"}>
          <Table
            captionSide="top"
            striped
            highlightOnHover
            withTableBorder
            withColumnBorders
          >
            <Table.Thead>
              <Table.Th>Serviço</Table.Th>
              <Table.Th>Dentes</Table.Th>
              <Table.Th>Qtd</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Thead>
            <Table.Tbody>
              {form.values.services?.map((service: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td>
                    {`${getSelectedService(service?.serviceId as number)}`}
                  </Table.Td>
                  <Table.Td>{`${
                    typeof service?.dent === "object"
                      ? service?.dent?.join(", ")
                      : service?.dent
                  }`}</Table.Td>
                  <Table.Td>{`${service?.amount ?? 0}`}</Table.Td>
                  <Table.Td>
                    <ActionIcon
                      onClick={() => {
                        form.removeListItem("services", index);
                      }}
                      color="red"
                    >
                      <Trash />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          {!form.values.services?.length ? (
            <Box h={"24vh"}>
              <NoData />
            </Box>
          ) : null}
          {}
        </Table.ScrollContainer>

        <Table.ScrollContainer minWidth={"100%"} h={"32vh"} mah={"32vh"}>
          <Table
            captionSide="top"
            striped
            highlightOnHover
            withTableBorder
            withColumnBorders
          >
            <Table.Thead>
              <Table.Th>Produto</Table.Th>
              <Table.Th>Qtd</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Thead>
            <Table.Tbody>
              {form.values.products?.map((product: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td>
                    {`${getSelectedProduct(product?.productId as number)}`}
                  </Table.Td>
                  <Table.Td>{`${product?.amount ?? 0}`}</Table.Td>
                  <Table.Td>
                    <ActionIcon
                      onClick={() => {
                        form.removeListItem("products", index);
                      }}
                      color="red"
                    >
                      <Trash />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          {!form.values.products?.length ? (
            <Box h={"24vh"}>
              <NoData />
            </Box>
          ) : null}
        </Table.ScrollContainer>
      </Stack>
    );
  };

  return (
    <SimpleGrid cols={2} h={"100%"}>
      {renderForm()}
      {renderTables()}
    </SimpleGrid>
  );
}
