import {
  Box,
  Button,
  Checkbox,
  Grid,
  Group,
  NumberInput,
  Paper,
  Radio,
  SimpleGrid,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { PatternFormat } from "react-number-format";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Check, X } from "tabler-icons-react";
import { removeCPFMask } from "../../../../utils";
import {
  createClient,
  getClient,
  getInfosByZip,
  updateClient,
} from "./index.service";
import { clientSchema, clientSchemaInitialValues } from "./schema";
import { DateInput } from "@mantine/dates";

export default function AddClient() {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const { mutate, isLoading } = useMutation(createClient);
  const { mutate: updateMutate, isLoading: updateIsLoading } =
    useMutation(updateClient);

  const form = useForm({
    validate: yupResolver(clientSchema),
    initialValues: clientSchemaInitialValues,
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  const { data } = useQuery("get-client", () => getClient(clientId as string), {
    enabled: Boolean(clientId),
    // onSuccess(data: any) {
    //   if (clientId) {
    //     form.setValues({
    //       city: data?.city,
    //       complement: data?.complement,
    //       district: data?.district,
    //       name: data?.name,
    //       number: data?.number,
    //       phone: data?.phone?.replace("55", ""),
    //       cro: data?.cro ?? "",
    //       state: data?.state,
    //       street: data?.street,
    //       zip: data?.zip,
    //       CPF: data?.CPF,
    //       email: data?.email,
    //       clientType: data?.CPF
    //         ? data?.CPF?.length === 11
    //           ? "PF"
    //           : "PJ"
    //         : "PF",
    //       orderCollection: Boolean(data?.orderCollection),
    //       dateOfBirth: data?.dateOfBirth
    //         ? (new Date(data?.dateOfBirth) as any)
    //         : undefined,
    //     });
    //   }
    // },
  });

  useEffect(() => {
    if (clientId && data) {
      const client = data as any;

      form.setValues({
        city: client?.city,
        complement: client?.complement,
        district: client?.district,
        name: client?.name,
        number: client?.number,
        phone: client?.phone?.replace("55", ""),
        cro: client?.cro ?? "",
        state: client?.state,
        street: client?.street,
        zip: client?.zip,
        CPF: client?.CPF,
        email: client?.email,
        clientType: client?.CPF
          ? client?.CPF?.length === 11
            ? "PF"
            : "PJ"
          : "PF",
        orderCollection: Boolean(client?.orderCollection),
        dateOfBirth: client?.dateOfBirth
          ? (new Date(client?.dateOfBirth) as any)
          : undefined,
      });
    }
  }, [data]);

  const onSubmit = (): void => {
    const { hasErrors } = form.validate();

    if (hasErrors) return;

    if (!clientId) {
      const dataToSend = {
        name: form.values.name,
        orderCollection: Boolean(form.values.orderCollection),
        phone: `55${removeCPFMask(form.values.phone)}`,
        dateOfBirth: form.values.dateOfBirth
          ? new Date(form.values.dateOfBirth)?.toISOString()
          : null,
        cro: form.values.cro,
        city: form.values.city,
        district: form.values.district,
        number: Number(form.values.number),
        state: form.values.state,
        street: form.values.street,
        zip: removeCPFMask(form.values.zip),
        complement: form.values.complement,
        CPF: removeCPFMask(form.values.CPF),
        email: form.values.email,
      };

      mutate(dataToSend, {
        onSuccess() {
          notifications.show({
            title: "Cliente cadastrado",
            message: "A ação de cadastrar cliente foi concluída com sucesso!",
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
          navigate("/clients");
        },
        onError(err: any) {
          notifications.show({
            title: "Falha ao cadastrar cliente",
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
        orderCollection: Boolean(form.values.orderCollection),
        phone: `55${removeCPFMask(form.values.phone)}`,
        dateOfBirth: form.values.dateOfBirth
          ? new Date(form.values.dateOfBirth)?.toISOString()
          : null,
        cro: form.values.cro,
        city: form.values.city,
        district: form.values.district,
        number: Number(form.values.number),
        state: form.values.state,
        street: form.values.street,
        zip: removeCPFMask(form.values.zip),
        complement: form.values.complement,
        clientId,
        CPF: removeCPFMask(form.values.CPF),
        email: form.values.email,
      };

      console.log(dataToSend);

      updateMutate(dataToSend, {
        onSuccess() {
          notifications.show({
            title: "Cliente editado",
            message: "A ação de editar cliente foi concluída com sucesso!",
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
          navigate("/clients");
        },
        onError(err: any) {
          notifications.show({
            title: "Falha ao editar cliente",
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

  useEffect(() => {
    if (!data?.zip) {
      const zip = removeCPFMask(form.values.zip);

      if (zip?.trim()?.length === 8) {
        getInfosByZip(zip)
          ?.then((res) => {
            form.setFieldValue("state", res?.uf ?? undefined);
            form.setFieldValue("city", res?.localidade ?? undefined);
            form.setFieldValue("district", res?.bairro ?? undefined);
            form.setFieldValue("street", res?.logradouro ?? undefined);
            form.setFieldValue("complement", res?.complemento ?? undefined);
          })
          ?.catch(() => {
            notifications.show({
              title: "Falha ao buscar CEP",
              message:
                "Os dados de endereço devem ser preenchidos manualmente.",
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
          });
      } else {
        form.setFieldValue("state", "");
        form.setFieldValue("city", "");
        form.setFieldValue("district", "");
        form.setFieldValue("street", "");
        form.setFieldValue("complement", "");
      }
    }
  }, [form.values.zip]);

  return (
    <Stack>
      <Box style={{ padding: "1.5rem 2rem" }}>
        <Stack w={"90%"} mt={"4rem"} style={{ gap: "1.5rem" }}>
          <Paper shadow="xl" p="2rem" radius={"lg"}>
            <Checkbox
              label="Cobrança de pedidos"
              description='Ao desmarcar a opção "Cobrança de pedidos", os pedidos do cliente NÃO serão contabilizados na apuração financeira.'
              {...form.getInputProps("orderCollection", { type: "checkbox" })}
            />
            <SimpleGrid cols={3} mt="1rem">
              <TextInput
                label="Nome completo"
                {...form.getInputProps("name")}
              />
              <TextInput label="CRO" {...form.getInputProps("cro")} />
              <PatternFormat
                format="(##) ####-####"
                customInput={TextInput}
                label="Telefone"
                mask={"_"}
                {...form.getInputProps("phone")}
              />
            </SimpleGrid>
            <SimpleGrid cols={4}>
              <Radio.Group
                label="Tipo de cliente"
                {...form.getInputProps("clientType")}
              >
                <Group>
                  <Radio label="Pessoa física" value="PF" />
                  <Radio label="Pessoa jurídica" value="PJ" />
                </Group>
              </Radio.Group>
              <PatternFormat
                format={
                  form.values?.clientType === "PF"
                    ? "###.###.###-##"
                    : "##.###.###/####-##"
                }
                customInput={TextInput}
                label={form.values?.clientType === "PF" ? "CPF" : "CNPJ"}
                mask={"_"}
                {...form.getInputProps("CPF")}
              />
              <DateInput
                label="Data de nascimento"
                valueFormat="DD/MM/YYYY"
                locale="pt-BR"
                clearable
                {...form.getInputProps("dateOfBirth")}
              />
              <TextInput
                type="email"
                label="Email"
                {...form.getInputProps("email")}
              />
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <PatternFormat
                format="#####-###"
                customInput={TextInput}
                label="CEP"
                mask={"_"}
                {...form.getInputProps("zip")}
              />
            </SimpleGrid>
            <SimpleGrid cols={3}>
              <TextInput label="Estado" {...form.getInputProps("state")} />
              <TextInput label="Cidade" {...form.getInputProps("city")} />
              <TextInput label="Bairro" {...form.getInputProps("district")} />
            </SimpleGrid>
            <Grid>
              <Grid.Col span={10}>
                <TextInput label="Rua" {...form.getInputProps("street")} />
              </Grid.Col>
              <Grid.Col span={2}>
                <NumberInput label="Número" {...form.getInputProps("number")} />
              </Grid.Col>
            </Grid>
            <SimpleGrid cols={2}>
              <TextInput
                label="Complemento"
                {...form.getInputProps("complement")}
              />
            </SimpleGrid>
          </Paper>
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
