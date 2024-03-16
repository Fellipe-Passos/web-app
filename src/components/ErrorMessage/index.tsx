import { Text } from "@mantine/core";

interface IErrorMessage {
  text?: string;
}

export default function ErrorMessage({ text }: IErrorMessage) {
  return <Text c={"red"}>{text}</Text>;
}
