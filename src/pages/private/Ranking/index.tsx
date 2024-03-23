import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Tooltip as MantineTooltip,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Eye } from "tabler-icons-react";
import {
  getProductionLine,
  getProductionLineAndRanking,
} from "./index.service";
import { translateRole } from "../../../utils";
import NoData from "../../../components/NoData";
import Loading from "../../../components/Loading";
import BarChart from "../../../components/Chart";

interface RankingProps {
  padding?: string;
}

function Ranking({ padding }: RankingProps) {
  const [opened, { close, open }] = useDisclosure(false);
  const [usersProductionData, setUsersProductionData] = useState<any | null>();
  const queryClient = useQueryClient();

  const currentDate = new Date()?.toLocaleDateString("pt-br");

  const { data, isLoading: rankingIsLoading } = useQuery(
    "productionLine-ranking",
    getProductionLineAndRanking
  );

  const { data: productionLine, isLoading: productionLineIsLoading } = useQuery(
    "production-line",
    getProductionLine
  );

  useEffect(() => {
    const interval = setInterval(() => {
      // Refetch das queries
      queryClient.invalidateQueries("productionLine-ranking");
      queryClient.invalidateQueries("production-line");

      window.location.reload();
    }, 60000);

    // Limpeza do intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, []);

  // const openFullscreen = () => {
  //   const width = screen.width;
  //   const height = screen.height;

  //   window.open("/ranking-full", "_blank", `width=${width},height=${height}`);
  // };

  const tables = productionLine?.tables;
  const rankings = data?.rankings;

  return (
    <Stack h={"100%"}>
      <Group justify="end" display={padding ? "none" : "flex"}>
        {/* <MantineTooltip label="Tela cheia">
          <ActionIcon c={'main'} onClick={openFullscreen}>
            <Resize />
          </ActionIcon>
        </MantineTooltip> */}
      </Group>
      <Stack h={"47.5vh"}>
        <SimpleGrid cols={3}>
          <Stack h={"47.5vh"} style={{ gap: 0 }}>
            <Text fz={"1rem"} fw={800} c={"main"}>
              Pedidos em andamento
            </Text>
            <Paper
              shadow="xl"
              h={"100%"}
              mah={"47.5vh"}
              style={{ borderRadius: "10px", overflow: "hidden" }}
            >
              <Table.ScrollContainer minWidth={"100%"} mah={"47.5vh"}>
                <Table striped>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Colaborador</Table.Th>
                      <Table.Th>Setor</Table.Th>
                      <Table.Th>Pedidos</Table.Th>
                      <Table.Th>Atrasados</Table.Th>
                      <Table.Th>Ações</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {tables?.ordersInProgressByUser?.map(
                      (order: any, index: number) => (
                        <Table.Tr key={index}>
                          <Table.Td>{order?.user ?? "-"}</Table.Td>
                          <Table.Td>{translateRole(order?.role)}</Table.Td>
                          <Table.Td>{order?.ordersInProgress ?? 0}</Table.Td>
                          <Table.Td>{order?.backorders ?? 0}</Table.Td>
                          <Table.Td>
                            <MantineTooltip label="Visualizar pedidos">
                              <ActionIcon
                                onClick={() => {
                                  setUsersProductionData(order);
                                  open();
                                }}
                              >
                                <Eye />
                              </ActionIcon>
                            </MantineTooltip>
                          </Table.Td>
                        </Table.Tr>
                      )
                    )}
                  </Table.Tbody>
                </Table>
                {!tables?.ordersInProgressByUser?.length &&
                  !productionLineIsLoading && (
                    <Group
                      w={"100%"}
                      justify="center"
                      h={"37vh"}
                      align="center"
                    >
                      <NoData />
                    </Group>
                  )}
                {productionLineIsLoading && (
                  <Group w={"100%"} justify="center" h={"37vh"} align="center">
                    <Loading />
                  </Group>
                )}
              </Table.ScrollContainer>
            </Paper>
          </Stack>

          <Stack h={"47.5vh"} style={{ gap: 0 }}>
            <Text fz={"1rem"} fw={800} c={"main"}>
              {`Pedidos finalizados - ${currentDate}`}
            </Text>
            <Paper
              shadow="xl"
              h={"100%"}
              mah={"47.5vh"}
              style={{ borderRadius: "10px", overflow: "hidden" }}
            >
              <Table.ScrollContainer minWidth={"100%"} mah={"47.5vh"}>
                <Table striped>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Pedido</Table.Th>
                      <Table.Th>Cliente</Table.Th>
                      <Table.Th>Finalizado</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {tables?.finished?.map((order: any, index: number) => (
                      <Table.Tr key={index}>
                        <Table.Td>{order?.order ?? "-"}</Table.Td>
                        <Table.Td>{order?.client ?? "-"}</Table.Td>
                        <Table.Td>{order?.finishedAt}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
                {!tables?.finished?.length && !productionLineIsLoading && (
                  <Group w={"100%"} justify="center" h={"37vh"} align="center">
                    <NoData />
                  </Group>
                )}
                {productionLineIsLoading && (
                  <Group w={"100%"} justify="center" h={"37vh"} align="center">
                    <Loading />
                  </Group>
                )}
              </Table.ScrollContainer>
            </Paper>
          </Stack>

          <Stack h={"47.5vh"} style={{ gap: 0 }}>
            <Text fz={"1rem"} fw={800} c={"main"}>
              {`Pedidos entregues - ${currentDate}`}
            </Text>
            <Paper
              h={"100%"}
              shadow="xl"
              mah={"47.5vh"}
              style={{ borderRadius: "10px", overflow: "hidden" }}
            >
              <Table.ScrollContainer minWidth={"100%"} mah={"47.5vh"}>
                <Table striped>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Pedido</Table.Th>
                      <Table.Th>Cliente</Table.Th>
                      <Table.Th>Finalizado</Table.Th>
                      <Table.Th>Entregue</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {tables?.delivered?.map((order: any, index: number) => (
                      <Table.Tr key={index}>
                        <Table.Td>{order?.order ?? "-"}</Table.Td>
                        <Table.Td>{order?.client ?? "-"}</Table.Td>
                        <Table.Td>{order?.finishedAt}</Table.Td>
                        <Table.Td>{order?.deliveredAt}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
                {!tables?.delivered?.length && !productionLineIsLoading && (
                  <Group w={"100%"} justify="center" h={"37vh"} align="center">
                    <NoData />
                  </Group>
                )}
                {productionLineIsLoading && (
                  <Group w={"100%"} justify="center" h={"37vh"} align="center">
                    <Loading />
                  </Group>
                )}
              </Table.ScrollContainer>
            </Paper>
          </Stack>
        </SimpleGrid>
      </Stack>

      <Stack h={"47.5vh"}>
        <SimpleGrid cols={4} h={"40vh"}>
          {rankings?.PLASTER?.length ? (
            <Paper shadow="xl" h={"100%"} p={"1rem"}>
              <BarChart data={rankings?.PLASTER} title="Gesso" />
            </Paper>
          ) : !rankings?.PLASTER?.length && !rankingIsLoading ? (
            <Paper shadow="xl" h={"100%"}>
              <NoData />
            </Paper>
          ) : (
            <Paper shadow="xl" h={"100%"}>
              <Loading />
            </Paper>
          )}

          {rankings?.DIGITAL?.length ? (
            <Paper shadow="xl" h={"100%"} p={"1rem"}>
              <BarChart data={rankings?.DIGITAL} title="Digital" />
            </Paper>
          ) : !rankings?.DIGITAL?.length && !rankingIsLoading ? (
            <Paper shadow="xl" h={"100%"}>
              <NoData />
            </Paper>
          ) : (
            <Paper shadow="xl" h={"100%"}>
              <Loading />
            </Paper>
          )}

          {rankings?.MILLING?.length ? (
            <Paper shadow="xl" h={"100%"} p={"1rem"}>
              <BarChart data={rankings?.MILLING} title="Fresagem" />
            </Paper>
          ) : !rankings?.MILLING?.length && !rankingIsLoading ? (
            <Paper shadow="xl" h={"100%"}>
              <NoData />
            </Paper>
          ) : (
            <Paper shadow="xl" h={"100%"}>
              <Loading />
            </Paper>
          )}

          {rankings?.FINISHING?.length ? (
            <Paper shadow="xl" h={"100%"} p={"1rem"}>
              <BarChart data={rankings?.FINISHING} title="Acabamento" />
            </Paper>
          ) : !rankings?.FINISHING?.length && !rankingIsLoading ? (
            <Paper shadow="xl" h={"100%"}>
              <NoData />
            </Paper>
          ) : (
            <Paper shadow="xl" h={"100%"}>
              <Loading />
            </Paper>
          )}
        </SimpleGrid>
      </Stack>
      <Modal
        opened={opened}
        title={usersProductionData?.user ?? "-"}
        centered
        onClose={close}
        size={"60vw"}
        radius={"xl"}
        styles={{
          title: {
            fontWeight: 800,
            color: "grey",
          },
        }}
      >
        {usersProductionData?.orders?.length ? (
          <Table.ScrollContainer minWidth={"100%"} mah={"50vh"} h={"50vh"}>
            <Table striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Pedido</Table.Th>
                  <Table.Th>Cliente</Table.Th>
                  <Table.Th>Descrição</Table.Th>
                  <Table.Th>Prazo</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {usersProductionData?.orders?.map(
                  (order: any, index: number) => {
                    const current = new Date();
                    current.setHours(0, 0, 0, 0);

                    const stageTime = new Date(order?.time ?? 0);

                    let status;

                    // Convertendo as datas para milissegundos
                    const currentMillis = current.getTime();
                    const stageTimeMillis = stageTime.getTime();

                    // Calculando a diferença em milissegundos
                    const differenceInMilliseconds =
                      currentMillis - stageTimeMillis;

                    // Convertendo a diferença para dias
                    const differenceInDays = Math.ceil(
                      differenceInMilliseconds / (1000 * 60 * 60 * 24)
                    );

                    if (differenceInDays === 0) {
                      status = "TODAY";
                    }

                    if (differenceInDays > 0) {
                      status = "LATE";
                    }

                    if (differenceInDays < 0) {
                      status = "ON_TIME";
                    }

                    return (
                      <Table.Tr key={index}>
                        <Table.Td>{order?.orderId}</Table.Td>
                        <Table.Td>{order?.order?.client?.name}</Table.Td>
                        <Table.Td>
                          {order?.order?.services?.length
                            ? `${order?.order?.services[0]?.amount} ${order?.order?.services[0]?.service?.name}...`
                            : "-"}
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={
                              status === "TODAY"
                                ? "blue"
                                : status === "ON_TIME"
                                ? "teal"
                                : status === "LATE"
                                ? "red"
                                : "gray"
                            }
                          >
                            {stageTime?.toLocaleDateString("pt-BR", {
                              timeZone: "UTC",
                            })}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    );
                  }
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        ) : null}
        {!usersProductionData?.orders?.length && (
          <Box mah={"50vh"} h={"50vh"}>
            <NoData />
          </Box>
        )}
      </Modal>
    </Stack>
  );
}

export default Ranking;
