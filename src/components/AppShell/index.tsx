import {
  AppShell as MantineAppShell,
  Burger,
  Title,
  NavLink,
  Group,
  Text,
  Button,
  Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { navbarOptions } from "./permissions";
import { UserRoles } from "../../types/user";
import { ChevronLeft, ChevronRight, Logout } from "tabler-icons-react";
import logo from "../../assets/logo.png";
import classes from "./index.module.css";
import { useNavigate } from "react-router-dom";

interface AppShellProps {
  pageTitle: string;
  children: JSX.Element;
  returnButton?: boolean;
}

export function AppShell({ children, pageTitle, returnButton }: AppShellProps) {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();

  const options = navbarOptions(UserRoles.Root);

  return (
    <MantineAppShell
      layout="alt"
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <MantineAppShell.Header pl={"md"} pr={"md"} className={classes.header}>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Group>
          {returnButton && (
            <Button
              variant="subtle"
              leftSection={<ChevronLeft />}
              onClick={() => navigate(-1)}
            >
              Voltar
            </Button>
          )}
          <Title c={"main.4"}>{pageTitle}</Title>
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar className={classes.navbar}>
        <MantineAppShell.Section className={classes.section}>
          <Image src={logo} />
        </MantineAppShell.Section>

        <MantineAppShell.Section pt={"md"} h={"100%"}>
          {options?.map((option) => (
            <NavLink
              style={{ color: "black" }}
              label={
                <Group justify="space-between">
                  <Group>
                    <option.icon />
                    <Text>{option?.text}</Text>
                  </Group>
                  <ChevronRight />
                </Group>
              }
              onClick={() => navigate(option?.URL)}
              key={option?.text}
            />
          ))}
        </MantineAppShell.Section>

        <MantineAppShell.Section className={classes.footer}>
          <Button
            leftSection={<Logout />}
            fullWidth
            onClick={() => {
              localStorage.removeItem("@ProductionLine:token");
              navigate("/");
            }}
          >
            Sair do sistema
          </Button>
        </MantineAppShell.Section>
      </MantineAppShell.Navbar>

      <MantineAppShell.Main
        style={{
          // backgroundColor: "#f7f7f7",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
