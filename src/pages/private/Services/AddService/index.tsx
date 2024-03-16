import {
  Box,
  Button,
  Checkbox,
  Group,
  SimpleGrid,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { NumericFormat } from "react-number-format";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Check, X } from "tabler-icons-react";
import { removeCurrencyMask } from "../../../../utils";
import { createService, getService, updateService } from "./index.service";
import { serviceSchema, serviceSchemaInitialValues } from "./schema";

export default function AddNewService() {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const { mutate, isLoading } = useMutation(createService);
  const { mutate: updateMutate, isLoading: updateIsLoading } =
    useMutation(updateService);

  const form = useForm({
    validate: yupResolver(serviceSchema),
    initialValues: serviceSchemaInitialValues,
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  useQuery("get-service", () => getService(serviceId as string), {
    enabled: Boolean(serviceId),
    onSuccess(data: any) {
      if (serviceId) {
        form.setValues({
          name: data?.name,
          price: data?.price,
          commissionedItem: Boolean(data?.commissionedItem),
        });
      }
    },
  });

  const onSubmit = (): void => {
    const { hasErrors } = form.validate();

    if (hasErrors) return;

    if (!serviceId) {
      const dataToSend = {
        name: form.values.name,
        price: removeCurrencyMask(form.values.price)?.toString(),
        commissionedItem: Boolean(form.values.commissionedItem),
      };

      mutate(dataToSend, {
        onSuccess() {
          notifications.show({
            title: "Serviço cadastrado",
            message: "A ação de cadastrar serviço foi concluída com sucesso!",
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
          navigate("/services-dashboard");
        },
        onError(err: any) {
          notifications.show({
            title: "Falha ao cadastrar serviço",
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
      const dataToSend = {
        name: form.values.name,
        price: removeCurrencyMask(form.values.price)?.toString(),
        serviceId: serviceId as string,
        commissionedItem: Boolean(form.values.commissionedItem),
      };

      updateMutate(dataToSend, {
        onSuccess() {
          notifications.show({
            title: "Serviço editado",
            message: "A ação de editar serviço foi concluída com sucesso!",
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
          navigate("/services-dashboard");
        },
        onError(err: any) {
          notifications.show({
            title: "Falha ao editar serviço",
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

  return (
    <Stack>
      <Box style={{ padding: "1.5rem 2rem" }}>
        <Stack w={"60%"} mt={"4rem"} style={{ gap: "1.5rem" }}>
          <SimpleGrid cols={3}>
            <TextInput
              label="Nome do serviço"
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
              label="Valor do serviço"
              {...form.getInputProps("price")}
            />
            <Group h={"100%"} align="flex-end">
              <Checkbox
                label="Item comissionado?"
                labelPosition="left"
                color="orange"
                {...form.getInputProps("commissionedItem", {
                  type: "checkbox",
                })}
              />
            </Group>
          </SimpleGrid>
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
    </Stack>
  );
}
