import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { NumericFormat } from "react-number-format";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Check, Plus, X } from "tabler-icons-react";
import { removeCurrencyMask } from "../../../../utils";
import {
  CreateCategory,
  InventoryEnum,
  categoriesToSelect,
  createProduct,
  getProduct,
  inventoryToSelect,
  listCategories,
  updateProduct,
} from "./index.service";
import { productSchema, productSchemaInitialValues } from "./schema";
import {
  getClientsToSelect,
  listClients,
} from "../../Orders/NewOrder/services/clients.service";
import { useDisclosure } from "@mantine/hooks";
import {
  categorySchema,
  categorySchemaInitialValues,
} from "./schema/categoryForm";

export default function AddProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { productId } = useParams();
  const { mutate, isLoading } = useMutation(createProduct);
  const { mutate: updateMutate, isLoading: updateIsLoading } =
    useMutation(updateProduct);

  const { mutate: createCategoryMutate, isLoading: createCategoryIsLoading } =
    useMutation(CreateCategory);

  const [opened, { close, open }] = useDisclosure();

  const { data: clientsData } = useQuery("list-clients", listClients);

  const { data: categoriesData } = useQuery("list-categories", listCategories);

  useQuery("get-product", () => getProduct(productId as string), {
    enabled: Boolean(productId),
    onSuccess(data: any) {
      if (productId) {
        form.setValues({
          brand: data?.brand,
          name: data?.name,
          price: data?.price,
          qtd: data?.qtd ?? "0",
          table: data?.table,
          categoryId: data?.categoryId?.toString(),
        });
      }
    },
  });

  const form = useForm({
    validate: yupResolver(productSchema),
    initialValues: productSchemaInitialValues,
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  const categoryForm = useForm({
    validate: yupResolver(categorySchema),
    initialValues: categorySchemaInitialValues,
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  const onSubmit = (): void => {
    const { hasErrors } = form.validate();

    if (hasErrors) return;

    if (!productId) {
      const dataToSend: any = {
        name: form.values.name,
        price: removeCurrencyMask(form.values.price)?.toString(),
        brand: form.values.brand,
        qtd: Number(form.values.qtd),
        table: form.values.table,
        categoryId: Number(form.values.categoryId),
      };

      if (form.values.clientId && form.values.table === InventoryEnum.Clients) {
        dataToSend.clientId = Number(form.values.clientId);
      }

      mutate(dataToSend, {
        onSuccess() {
          notifications.show({
            title: "Material cadastrado",
            message: "A ação de cadastrar material foi concluída com sucesso!",
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
          navigate("/products");
        },
        onError(err: any) {
          notifications.show({
            title: "Falha ao cadastrar material",
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
    } else {
      const dataToSend: any = {
        name: form.values.name,
        price: removeCurrencyMask(form.values.price)?.toString(),
        brand: form.values.brand,
        productId: productId as string,
        qtd: Number(form.values.qtd),
        table: form.values.table,
        categoryId: Number(form.values.categoryId),
      };

      if (form.values.clientId && form.values.table === InventoryEnum.Clients) {
        dataToSend.clientId = Number(form.values.clientId);
      }

      updateMutate(dataToSend, {
        onSuccess() {
          notifications.show({
            title: "Produto editado",
            message: "A ação de editar produto foi concluída com sucesso!",
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
          navigate("/products");
        },
        onError(err: any) {
          notifications.show({
            title: "Falha ao editar produto",
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
    }
  };

  const onCreateCategory = () => {
    createCategoryMutate(
      { category: categoryForm.values.category },
      {
        onSuccess() {
          queryClient.invalidateQueries(["list-categories"]);
        },
      }
    );
  };

  return (
    <Stack>
      <Box style={{ padding: "1.5rem 2rem" }}>
        <Stack w={"100%"} mt={"4rem"} style={{ gap: "1.5rem" }}>
          <Group>
            <Select
              searchable
              clearable
              label="Tabela"
              data={inventoryToSelect()}
              {...form.getInputProps("table")}
            />
            <Group align="end">
              <Select
                searchable
                clearable
                label="Categoria"
                data={categoriesToSelect(categoriesData as any[] | undefined)}
                {...form.getInputProps("categoryId")}
              />
              <Tooltip label="Adicionar nova categoria">
                <ActionIcon onClick={open}>
                  <Plus />
                </ActionIcon>
              </Tooltip>
            </Group>
            {form.values.table === InventoryEnum.Clients && (
              <Select
                label="Cliente"
                data={getClientsToSelect(clientsData)}
                {...form.getInputProps("clientId")}
              />
            )}

            <TextInput label="Marca" {...form.getInputProps("brand")} />
            <TextInput
              label="Nome do material"
              {...form.getInputProps("name")}
            />
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              customInput={TextInput}
              label="Valor do material"
              {...form.getInputProps("price")}
            />
            <TextInput
              label="Quantidade em estoque"
              {...form.getInputProps("qtd")}
            />
          </Group>
          <SimpleGrid cols={2} mt={"2rem"}>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              loading={isLoading || updateIsLoading}
            >
              Cancelar
            </Button>
            <Button onClick={onSubmit} loading={isLoading || updateIsLoading}>
              Salvar
            </Button>
          </SimpleGrid>
        </Stack>
      </Box>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title="Adicionar nova categoria"
      >
        <Stack>
          <TextInput
            label="Categoria"
            {...categoryForm.getInputProps("category")}
          />
          <Group justify="space-between">
            <Button
              loading={createCategoryIsLoading}
              variant="outline"
              onClick={close}
            >
              Cancelar
            </Button>
            <Button
              loading={createCategoryIsLoading}
              onClick={onCreateCategory}
            >
              Salvar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
