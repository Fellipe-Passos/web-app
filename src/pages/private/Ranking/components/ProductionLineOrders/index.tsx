import React from "react";
import { Stack, Text, Grid, Box, Group } from "@mantine/core";
import NoData from "../../../../../components/NoData";

const ProductionLineOrders: React.FC<{ data: any }> = ({ data }) => {
  return (
    <Stack pl={".5rem"} pr={".5rem"}>
      {data?.map((line: any) => {
        return (
          <Stack style={{ gap: 0 }}>
            <Text fz={"1.15rem"} fw={800} c="orange">
              {line?.professional}
            </Text>
            {line?.orders?.map((order: any) => (
              <Stack style={{ gap: 0 }}>
                <Grid p={0} m={0}>
                  <Grid.Col span={9} pl={0}>
                    <Text fz={".8rem"} fw={700}>
                      {order?.order}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={3} pr={0}>
                    <Group style={{ gap: ".3rem" }}>
                      <Box
                        style={{
                          width: "10px",
                          height: "10px",
                          backgroundColor:
                            order?.status === "LATE" ? "red" : "green",
                          borderRadius: "100%",
                        }}
                      />
                      <Text fz={".7rem"} fw={700}>
                        {order?.days}
                      </Text>
                    </Group>
                  </Grid.Col>
                </Grid>
                <Text fz={".8rem"}>{order?.client}</Text>
                <Text fz={".8rem"}>{order?.patient}</Text>
                <Text fz={".8rem"}>{order?.material}</Text>
              </Stack>
            ))}
          </Stack>
        );
      })}
      {!data?.length && (
        <Stack justify="center" h={"35vh"}>
          <NoData />
        </Stack>
      )}
    </Stack>
  );
};

export default ProductionLineOrders;
