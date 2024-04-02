import { Box, Stack, Title, useMantineTheme } from "@mantine/core";
import { MoodConfuzed } from "tabler-icons-react";

export default function NoData() {
  const { colors } = useMantineTheme();

  return (
    <Box
      style={{
        height: "100%",
        maxHeight: "60vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack align="center">
        <MoodConfuzed color={colors.main[4]} width={"4rem"} height={"4rem"} />
        <Title
          order={6}
          style={{
            fontFamily: "Rubik",
            color: colors.main[4],
            textAlign: "center",
          }}
        >
          Não existem dados disponíveis para exibição no momento.
        </Title>
      </Stack>
    </Box>
  );
}
