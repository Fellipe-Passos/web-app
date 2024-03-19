import {
  Button,
  Divider,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Badge,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  PigMoney,
  Trash,
  X,
} from "tabler-icons-react";
import { translateRole } from "../../../../../../utils";
import { useForm, yupResolver } from "@mantine/form";
import { stageSchema, stageSchemaInitialValues } from "../../schema/stages";
import {
  User,
  getRolesToSelect,
  getUserByRole,
  getUsersToSelect,
} from "../../services/users.service";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { UserRoles } from "../../../../../../types/user";
import { AddSteps } from "../../services/add-step.service";
import { useParams } from "react-router-dom";
import { getUserRole } from "../../../../../../utils/userToken";
import { notifications } from "@mantine/notifications";
import { StartOrder } from "../../services/start-step.service";
import { FinishStep } from "../../services/finish-step.service";
import { ReopenStep } from "../../services/reopen-step.service";
import { SendToFinancial } from "../../services/send-to-financial.service";
import { DeleteStage } from "../../services/delete-stage.service";

interface StepsFormProps {
  orderData: any;
}

export default function StagesDataForm({ orderData }: StepsFormProps) {
  const queryClient = useQueryClient();
  const userRole = getUserRole();
  const { orderId } = useParams();

  const form = useForm({
    validate: yupResolver(stageSchema),
    initialValues: stageSchemaInitialValues,
    validateInputOnChange: true,
  });

  const { data: userData } = useQuery(
    "user-by-role",
    () => getUserByRole({ role: form.values.role as UserRoles }),
    { enabled: Boolean(form.values.role) }
  );

  const { mutate: addStepMutate } = useMutation(AddSteps, {
    onSuccess() {
      queryClient.invalidateQueries(["view-order"]);
      queryClient.invalidateQueries(["user-by-role"]);
      form.reset();
    },
  });

  const { mutate: startOrderMutate, isLoading: startOrderIsLoading } =
    useMutation(StartOrder, {
      onSuccess() {
        queryClient.invalidateQueries(["view-order"]);
        queryClient.invalidateQueries(["user-by-role"]);
      },
      onError(err: any) {
        notifications.show({
          title: "Falha iniciar etapa",
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

  const { mutate: finishStepMutate, isLoading: finishStepIsLoading } =
    useMutation(FinishStep, {
      onSuccess() {
        queryClient.invalidateQueries(["view-order"]);
        queryClient.invalidateQueries(["user-by-role"]);
      },
      onError(err: any) {
        notifications.show({
          title: "Falha finalizar etapa",
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

  const { mutate: reopenStepMutate, isLoading: reopenStepIsLoading } =
    useMutation(ReopenStep, {
      onSuccess() {
        queryClient.invalidateQueries(["view-order"]);
        queryClient.invalidateQueries(["user-by-role"]);
      },
      onError(err: any) {
        notifications.show({
          title: "Falha ao reabrir etapa",
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

  const onSubmit = () => {
    const { hasErrors } = form.validate();

    if (hasErrors) return;

    const { professionalId, role, time } = form.values;

    const dataToSend = {
      stage: {
        orderId: orderId as string,
        role: role as UserRoles,
        professionalId: Number(professionalId),
        time: new Date(time)?.toISOString(),
      },
    };

    addStepMutate(dataToSend);
  };

  const { mutate: sendToFinancialMutate, isLoading: sendToFinancialIsLoading } =
    useMutation(SendToFinancial, {
      onSuccess() {
        notifications.show({
          title: "Pedido enviado para o setor financeiro",
          message:
            "A ação de enviar pedido para setor financeiro foi concluída com sucesso!",
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
        queryClient.invalidateQueries(["view-order"]);
        queryClient.invalidateQueries(["user-by-role"]);
      },
      onError(err: any) {
        notifications.show({
          title: "Falha ao reabrir etapa",
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

  const { mutate: deleteStageMutate, isLoading: deleteStageIsLoading } =
    useMutation(DeleteStage, {
      onSuccess() {
        notifications.show({
          title: "Etapa removida",
          message: "A ação de remover etapa foi concluída com sucesso!",
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
        queryClient.invalidateQueries(["view-order"]);
        queryClient.invalidateQueries(["user-by-role"]);
      },
      onError(err: any) {
        notifications.show({
          title: "Falha ao remover etapa",
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

  const finishedSteps = orderData?.productionStage?.filter(
    (stage: any) => stage?.finished
  );

  const allStepsIsFinishing =
    finishedSteps?.length === orderData?.productionStage?.length;

  return (
    <Stack>
      <Text fz={"1rem"} fw={600}>
        Adicionar nova etapa
      </Text>
      <SimpleGrid cols={4}>
        <Select
          label="Setor"
          data={getRolesToSelect()}
          {...form.getInputProps("role")}
        />

        <Select
          label="Profissional"
          data={getUsersToSelect(userData as User[])}
          {...form.getInputProps("professionalId")}
        />

        <DateInput
          clearable
          label="Date input"
          placeholder="Date input"
          valueFormat="DD/MM/YYYY"
          nextIcon={<ChevronRight />}
          previousIcon={<ChevronLeft />}
          color="main"
          {...form.getInputProps("time")}
        />

        <Group h="100%" align="flex-end">
          <Button color="green" onClick={onSubmit}>
            Cadastrar etapa
          </Button>
        </Group>
      </SimpleGrid>
      <Divider />
      {allStepsIsFinishing && !orderData?.finished && !orderData?.delivered && (
        <Group>
          <Button
            radius={"xl"}
            color="teal"
            leftSection={<PigMoney />}
            onClick={() => {
              sendToFinancialMutate({ orderId: Number(orderId) });
            }}
            loading={sendToFinancialIsLoading}
          >
            Enviar para setor financeiro
          </Button>
        </Group>
      )}
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Ordem</Table.Th>
            <Table.Th>Setor</Table.Th>
            <Table.Th>Colaborador</Table.Th>
            <Table.Th>Reajuste</Table.Th>
            <Table.Th>Prazo</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {orderData?.productionStage?.map((stage: any, index: number) => (
            <Table.Tr key={index}>
              <Table.Td>{`${index + 1}ª etapa`}</Table.Td>
              <Table.Td>{` ${translateRole(stage?.role)}`}</Table.Td>
              <Table.Td>{stage?.professional?.name ?? "-"}</Table.Td>
              <Table.Td>
                {!stage?.isReadjustment ? (
                  <Badge color="red">Não</Badge>
                ) : (
                  <Badge color="teal">Sim</Badge>
                )}
              </Table.Td>
              <Table.Td>
                {new Date(stage?.time ?? 0)?.toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                })}
              </Table.Td>
              <Table.Td>
                <Badge
                  size="sm"
                  color={
                    stage?.started
                      ? "teal"
                      : stage?.finished && !stage?.reopened
                      ? "pink"
                      : stage?.reopened
                      ? "yellow"
                      : "gray"
                  }
                >
                  {stage?.started
                    ? "Iniciado"
                    : stage?.finished && !stage?.reopened
                    ? `Finalizado em: ${new Date(
                        stage?.finishedAt ?? 0
                      )?.toLocaleDateString("pt-BR", {
                        timeZone: "UTC",
                      })}`
                    : stage?.reopened
                    ? `Reaberto em: ${new Date(
                        stage?.reopenedAt ?? 0
                      )?.toLocaleDateString("pt-BR", {
                        timeZone: "UTC",
                      })}`
                    : "Aguardando início"}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group justify="flex-end">
                  {!stage?.started && !stage?.finished && (
                    <Button
                      size="sm"
                      radius={"xl"}
                      color="green"
                      onClick={() => {
                        startOrderMutate({ stageId: stage?.id });
                      }}
                      loading={startOrderIsLoading}
                    >
                      Iniciar etapa
                    </Button>
                  )}
                  <Button
                    size="sm"
                    display={stage?.started ? "flex" : "none"}
                    radius={"xl"}
                    color="pink"
                    onClick={() => finishStepMutate({ stageId: stage?.id })}
                    loading={finishStepIsLoading}
                  >
                    Finalizar etapa
                  </Button>
                  {stage?.finished && (
                    <Button
                      size="sm"
                      radius={"xl"}
                      color="yellow"
                      onClick={() => reopenStepMutate({ stageId: stage?.id })}
                      display={
                        [
                          UserRoles?.Manager,
                          UserRoles.Ceo,
                          UserRoles.Root,
                        ]?.includes(userRole as UserRoles)
                          ? "block"
                          : "none"
                      }
                      loading={reopenStepIsLoading}
                    >
                      Reabrir etapa
                    </Button>
                  )}
                  {[
                    UserRoles.Ceo,
                    UserRoles.Root,
                    UserRoles.Administration,
                  ]?.includes(userRole as UserRoles) && (
                    <Tooltip label="Remover etapa">
                      <ActionIcon
                        color="red"
                        radius="xl"
                        loading={deleteStageIsLoading}
                        onClick={() => {
                          deleteStageMutate(stage?.id);
                        }}
                      >
                        <Trash />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
