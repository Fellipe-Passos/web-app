import {
  Accordion,
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Check, Pencil, Report, Trash, UserPlus, X } from "tabler-icons-react";
import Loading from "../../../../components/Loading";
import NoData from "../../../../components/NoData";
import Tabs from "../../../../components/Tabs";
import { formatCurrency, removeCurrencyMask } from "../../../../utils";
import { InventoryEnum, updateProduct } from "../AddProduct/index.service";
import { listProducts } from "./index.service";
import {
  inputManualSchema,
  inputManualSchemaInitialValues,
} from "./schema/inputManual";

export default function ProductsDashboard() {
  const [opened, { close, open }] = useDisclosure();
  const [activeTab, setActiveTab] = useState<InventoryEnum>(
    InventoryEnum.Inputs
  );
  const { mutate: updateMutate, isLoading: updateIsLoading } =
    useMutation(updateProduct);
  const { data, isLoading, mutate } = useMutation(listProducts);
  const navigate = useNavigate();

  useEffect(() => {
    mutate({ table: activeTab });
  }, [activeTab]);

  const inputManualForm = useForm({
    validate: yupResolver(inputManualSchema),
    initialValues: inputManualSchemaInitialValues,
    validateInputOnChange: true,
  });

  const productsToSelect = (): Array<{
    group: string;
    items: Array<{ value: string; label: string }>;
  }> => {
    if (!data || !data.length) return [];

    return data.map((category: any) => {
      return {
        group: category?.category,
        items: category?.products?.map((product: any) => ({
          label: product?.name ?? "-",
          value: product?.id?.toString() ?? "-",
        })),
      };
    });
  };

  const onDiscountProduct = (): void => {
    const product = data
      ?.flatMap((category: any) => category.products ?? [])
      ?.find(
        (product: any) =>
          product.id === Number(inputManualForm?.values?.productId)
      );

    if (!product) {
      notifications.show({
        title: "Não foi possível encontrar o pedido",
        message: "Ocorreu um erro ao buscar o pedido.",
        color: "red",
        icon: <X />,
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.red[0],
            borderColor: theme.colors.red[6],

            "&::before": { backgroundColor: theme.white },
          },

          title: { color: theme.colors.red[6] },
          description: { color: theme.colors.red[6] },
          closeButton: {
            color: theme.colors.red[6],
            "&:hover": { backgroundColor: theme.colors.red[1] },
          },
        }),
      });
      return;
    }

    const dataToSend = {
      productId: inputManualForm.values.productId,
      name: product?.name ?? "",
      price: removeCurrencyMask(product?.price ?? "")?.toString(),
      brand: product?.brand ?? "",
      qtd: Number(product?.qtd) - Number(inputManualForm.values.qtd),
      table: product?.table,
    };

    updateMutate(dataToSend, {
      onSuccess() {
        mutate({ table: activeTab });
        notifications.show({
          title: "Saída de produto reportada com sucesso!",
          message:
            "A ação de reportar saída de produto foi concluída com sucesso!",
          color: "green",
          icon: <Check />,
          styles: (theme) => ({
            root: {
              backgroundColor: theme.colors.green[0],
              borderColor: theme.colors.green[6],

              "&::before": { backgroundColor: theme.white },
            },

            title: { color: theme.colors.green[6] },
            description: { color: theme.colors.green[6] },
            closeButton: {
              color: theme.colors.green[6],
              "&:hover": { backgroundColor: theme.colors.green[1] },
            },
          }),
        });
        close();
        inputManualForm.reset();
      },
      onError(err: any) {
        notifications.show({
          title: "Falha ao reportar saída de produto",
          message: err?.response?.data ?? "",
          color: "red",
          icon: <X />,
          styles: (theme) => ({
            root: {
              backgroundColor: theme.colors.red[0],
              borderColor: theme.colors.red[6],

              "&::before": { backgroundColor: theme.white },
            },

            title: { color: theme.colors.red[6] },
            description: { color: theme.colors.red[6] },
            closeButton: {
              color: theme.colors.red[6],
              "&:hover": { backgroundColor: theme.colors.red[1] },
            },
          }),
        });
      },
    });
  };

  return (
    <Stack h={"100%"} style={{ overflow: "auto" }}>
      <Group justify="space-between">
        <div />
        <Tabs
          defaultValue={activeTab}
          onChange={async (e: InventoryEnum) => {
            setActiveTab(e);
          }}
          tabs={[
            { label: "Insumos", value: InventoryEnum.Inputs },
            { label: "Individuais (clientes)", value: InventoryEnum.Clients },
            { label: "Matérias-prima", value: InventoryEnum.RawMaterials },
            { label: "Produtos não-dentais", value: InventoryEnum.NonDental },
          ]}
        />
        <Button
          radius={"xl"}
          leftSection={<UserPlus />}
          onClick={() => navigate("/add-product")}
        >
          Adicionar novo produto ao estoque
        </Button>
      </Group>

      <Box mah={"100%"} style={{ overflow: "auto" }}>
        <Accordion>
          {data?.map((category: any, index: number) => (
            <Accordion.Item key={index} value={category?.id?.toString()}>
              <Accordion.Control>
                <Group justify="space-between">
                  <Text fw={700}>{`Categoria: ${category?.category}`}</Text>
                  <Text mr={"1rem"}>Clique para visualizar produtos</Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel
                mah={"50vh"}
                style={{
                  overflow: "auto",
                }}
              >
                {category?.products?.length ? (
                  <Table.ScrollContainer minWidth={"100%"}>
                    <Table striped>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Categoria</Table.Th>
                          {activeTab === InventoryEnum.Clients && (
                            <Table.Th>Cliente</Table.Th>
                          )}
                          <Table.Th>Marca</Table.Th>
                          <Table.Th>Nome</Table.Th>
                          <Table.Th>Preço</Table.Th>
                          <Table.Th>Qtd. Mínima</Table.Th>
                          <Table.Th>Qtd. Estoque</Table.Th>
                          <Table.Th>Ações</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {category?.products?.map((product: any) => {
                          const difference =
                            product.qtd - product.minimumQuantity;

                          const percentage =
                            (difference / product.minimumQuantity) * 100;

                          let badgeColorByPercentage = "grey";

                          if (percentage >= 50) {
                            badgeColorByPercentage = "teal";
                          } else if (percentage < 50 && percentage >= 25) {
                            badgeColorByPercentage = "yellow";
                          } else if (percentage < 25 && percentage >= 10) {
                            badgeColorByPercentage = "orange";
                          } else {
                            badgeColorByPercentage = "red";
                          }

                          return (
                            <Table.Tr key={product?.id}>
                              <Table.Td>{category?.category ?? "-"}</Table.Td>
                              {activeTab === InventoryEnum.Clients && (
                                <Table.Td>
                                  {product?.client?.name ?? "-"}
                                </Table.Td>
                              )}
                              <Table.Td>{product?.brand ?? "-"}</Table.Td>
                              <Table.Td style={{ paddingLeft: "1rem" }}>
                                {product?.name ?? "-"}
                              </Table.Td>
                              <Table.Td>
                                {formatCurrency(product?.price)}
                              </Table.Td>
                              <Table.Td>
                                {product?.minimumQuantity ?? 0}
                              </Table.Td>
                              <Table.Td>
                                <Badge
                                  color={badgeColorByPercentage}
                                  variant="light"
                                >
                                  {product?.qtd ?? 0}
                                </Badge>
                              </Table.Td>

                              <Table.Td>
                                <Group>
                                  <Tooltip label="Editar">
                                    <ActionIcon
                                      color="blue"
                                      radius={"xl"}
                                      onClick={() =>
                                        navigate(`/edit-product/${product?.id}`)
                                      }
                                    >
                                      <Pencil />
                                    </ActionIcon>
                                  </Tooltip>
                                  {[
                                    InventoryEnum.NonDental,
                                    InventoryEnum.RawMaterials,
                                  ]?.includes(activeTab) && (
                                    <Tooltip label="Reportar saída manualmente">
                                      <ActionIcon
                                        color="green"
                                        onClick={() => {
                                          open();
                                          inputManualForm.setFieldValue(
                                            "productId",
                                            product?.id?.toString()
                                          );
                                        }}
                                      >
                                        <Report />
                                      </ActionIcon>
                                    </Tooltip>
                                  )}
                                  <Tooltip label="Excluir">
                                    <ActionIcon>
                                      <Trash />
                                    </ActionIcon>
                                  </Tooltip>
                                </Group>
                              </Table.Td>
                            </Table.Tr>
                          );
                        })}
                      </Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
                ) : null}
                {!category?.products?.length && <NoData />}
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Box>

      {!data?.length && !isLoading && <NoData />}
      {!data?.length && isLoading && <Loading />}

      <Modal
        opened={opened}
        title={"Reportar saídas"}
        centered
        onClose={close}
        styles={{
          title: {
            fontWeight: 800,
            fontSize: "1.25rem",
          },
          root: {
            ".mantine-Modal-content": {
              padding: "2rem 0",
            },
          },
        }}
      >
        <Stack>
          <Select
            label="Selecione o produto"
            withAsterisk
            searchable
            clearable
            data={productsToSelect()}
            {...inputManualForm.getInputProps("productId")}
          />
          <TextInput
            label="Quantidade"
            withAsterisk
            {...inputManualForm.getInputProps("qtd")}
          />
          <Group justify="space-between">
            <Button loading={updateIsLoading} onClick={close} variant="outline">
              Cancelar
            </Button>
            <Button
              loading={updateIsLoading}
              onClick={() => onDiscountProduct()}
            >
              Salvar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
