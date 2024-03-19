import { Button, Group, Paper, Stack, Text } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useElementSize } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Check, DeviceFloppy, Download, X } from "tabler-icons-react";
import Tabs from "../../../../components/Tabs";
import OrderDataForm from "./components/OrderDataForm";
import StagesDataForm from "./components/StagesDataForm";
import { orderSchema, orderSchemaInitialValues } from "./schema";
import { createOrder, editOrder } from "./services/create-order.service";
import axios from "axios";
import baseURL from "../../../../config/api/baseURL";
import { getOrder } from "../Dashboard/index.service";

export default function NewOrder(): JSX.Element {
  const navigate = useNavigate();
  const { ref, height } = useElementSize();
  const { orderId } = useParams();
  const [loading, setIsLoading] = useState(false);

  const { data: orderData } = useQuery(
    "view-order",
    () => getOrder(orderId as string),
    { enabled: Boolean(orderId) }
  );

  const [activeTab, setActiveTab] = useState<"ORDER" | "PRODUCTION">("ORDER");

  const tabs = [{ label: "Dados do Pedido", value: "ORDER" }];

  if (orderId) {
    tabs.push(
      ...[
        { label: "Dados de Produção", value: "PRODUCTION" },
        { label: "Dados de Pagamento", value: "PAYMENT" },
      ]
    );
  }

  const form = useForm({
    validate: yupResolver(orderSchema),
    initialValues: orderSchemaInitialValues,
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  const { mutateAsync: createOrderMutate, isLoading: createOrderIsLoading } =
    useMutation(createOrder);

  const { mutateAsync: editOrderMutate, isLoading: editOrderIsLoading } =
    useMutation(editOrder);

  const onSubmit = async () => {
    const { hasErrors, errors } = form.validate();

    if (hasErrors) console.log(errors);

    const { values } = form;

    const dataToSend = {
      patientName: values?.patientName,
      clientId: Number(values?.clientId),
      message: values?.message,
      observations: values?.observations,
      color: values.color,
      laboratoryColor: values?.laboratoryColor ?? null,
      materialsSendedByClient: values.materialsSendedByClient,
      productIds: values.products?.map((product: any) => ({
        productId: Number(product?.productId),
        amount: Number(product?.amount),
      })),
      serviceIds: values.services?.map((service: any, index: number) => ({
        serviceId: Number(service?.serviceId),
        dent: service?.dent,
        amount: Number(service?.amount),
        orderOfPrecedence: index === 0 ? 1 : null,
      })),
    };

    if (!orderId) {
      createOrderMutate(dataToSend, {
        onSuccess(data) {
          notifications.show({
            title: "Pedido cadastrado",
            message: "A ação de cadastrar pedido foi concluída com sucesso!",
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
          navigate(`/edit-order/${data?.id}`);
        },
        onError(err: any) {
          notifications.show({
            title: "Falha ao cadastrar pedido",
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
      const dataToSendEdit = {
        orderId,
        patientName: values?.patientName,
        clientId: Number(values?.clientId),
        message: values?.message,
        observations: values?.observations,
        color: values.color,
        laboratoryColor: values?.laboratoryColor ?? null,
        materialsSendedByClient: values.materialsSendedByClient,
        productIds: values.products?.map((product: any) => ({
          id: Number(product?.id),
          productId: Number(product?.productId),
          amount: Number(product?.amount),
        })),
        serviceIds: values.services?.map((service: any, index: number) => ({
          id: Number(service?.id),
          serviceId: Number(service?.serviceId),
          dent: service?.dent,
          amount: Number(service?.amount),
          orderOfPrecedence: index === 0 ? 1 : null,
        })),
      };

      editOrderMutate(dataToSendEdit, {
        onSuccess(data) {
          notifications.show({
            title: "Pedido editado",
            message: "A ação de editar pedido foi concluída com sucesso!",
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
          navigate(`/edit-order/${data?.id}`);
        },
        onError(err: any) {
          notifications.show({
            title: "Falha ao editar pedido",
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

  const emitForm = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${baseURL.baseURLDev}/form-pdf/${orderId}`,
        {
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(blob);

      setIsLoading(false);

      window.open(fileURL, "_blank");
    } catch (error) {
      setIsLoading(false);

      console.error(error);
    }
  };

  return (
    <Stack justify="space-between" h={"100%"}>
      <Paper shadow="xl" p={"lg"} withBorder h={"100%"}>
        <Group justify="space-between" ref={ref}>
          <Group>
            {orderId && (
              <Button
                leftSection={<Download />}
                color="grape"
                onClick={emitForm}
                loading={loading}
              >
                Imprimir
              </Button>
            )}
            <Text fz="1.5rem" color="gray" fw={700}>
              Dados do pedido
            </Text>
          </Group>
          <Tabs
            tabs={tabs}
            defaultValue={activeTab}
            onChange={async (e: "ORDER" | "PRODUCTION") => {
              setActiveTab(e);
            }}
          />
        </Group>
        <form style={{ height: `calc(100% - ${height}px)` }}>
          {activeTab === "ORDER" && (
            <OrderDataForm orderData={orderData} form={form} />
          )}
          {activeTab === "PRODUCTION" && (
            <StagesDataForm orderData={orderData} />
          )}
        </form>
      </Paper>
      {activeTab === "ORDER" && (
        <Group justify="center">
          <Button
            leftSection={<DeviceFloppy />}
            loading={createOrderIsLoading || editOrderIsLoading}
            onClick={onSubmit}
          >
            Salvar
          </Button>
        </Group>
      )}
    </Stack>
  );
}
