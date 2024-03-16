import { Box, Group, Text } from "@mantine/core";
import React, { useEffect, useRef } from "react";

import ProductionLineOrders from "../ProductionLineOrders";
import { translateRole } from "../../../../../utils";
import { UserRoles } from "../../../../../types/user";

const ProductionLineBox: React.FC<{ productionLineKey: string; data: any }> = ({
  productionLineKey,
  data,
}) => {
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const box = boxRef.current;

    if (box) {
      let scrollTop = 0;
      const scrollStep = 1;
      const scrollInterval = 100;

      const scrollContent = () => {
        if (box.scrollTop < box.scrollHeight - box.clientHeight) {
          scrollTop += scrollStep;
          box.scrollTop = scrollTop;
        } else {
          scrollTop = 0;
          box.scrollTop = 0;
        }
      };

      const intervalId = setInterval(scrollContent, scrollInterval);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, []);

  return (
    <Box
      key={productionLineKey}
      ref={boxRef}
      mah={"48vh"}
      h={"48vh"}
      style={{
        overflow: "hidden",
        position: "relative",
        borderRadius: "16px",
        backgroundColor: "#F4F4F4",
      }}
    >
      <Group
        style={{
          padding: ".5rem",
          borderBottom: "2px solid grey",
          position: "sticky",
          top: 0,
          backgroundColor: "#F4F4F4",
        }}
        justify="center"
      >
        <Text fz={"1.15rem"} fw={800}>
          {translateRole(productionLineKey?.toUpperCase() as UserRoles)}
        </Text>
      </Group>

      <ProductionLineOrders data={data[productionLineKey]} />
    </Box>
  );
};

export default ProductionLineBox;
