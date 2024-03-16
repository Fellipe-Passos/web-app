import { Group, Loader, Text } from "@mantine/core";

export default function Loading(): JSX.Element {
  return (
    <Group h={"100%"} justify="center" align="center">
      <Text c={"gray"} fw={700}>
        Buscando resultados
      </Text>
      <Loader size="sm" color="gray" />
    </Group>
  );
}
