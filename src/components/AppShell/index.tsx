import {
  ActionIcon,
  Burger,
  Button,
  Group,
  Image,
  AppShell as MantineAppShell,
  NavLink,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { ArrowsMaximize, ChevronLeft, Logout } from "tabler-icons-react";
import logo from "../../assets/logo.png";
import { UserRoles } from "../../types/user";
import classes from "./index.module.css";
import { navbarOptions } from "./permissions";

interface AppShellProps {
  pageTitle: string;
  children: JSX.Element;
  returnButton?: boolean;
  fullScreen?: boolean;
}

export function AppShell({
  children,
  pageTitle,
  returnButton,
  fullScreen,
}: AppShellProps) {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();

  const options = navbarOptions(UserRoles.Root);

  const formattedOptions = options?.map((option: any, index: number) => {
    if (option?.child?.length) {
      return (
        <NavLink
          label={
            <Group justify="space-between">
              <Group>
                <option.icon />
                <Text>{option?.text}</Text>
              </Group>
            </Group>
          }
          onClick={() => navigate(option?.URL)}
          key={index}
        >
          {option?.child?.map((child: any, key: number) => (
            <NavLink
              label={
                <Group>
                  <child.icon />
                  <Text>{child?.text ?? "-"}</Text>
                </Group>
              }
              onClick={() => navigate(child?.URL)}
              key={key}
            />
          ))}
        </NavLink>
      );
    }

    return (
      <NavLink
        label={
          <Group justify="space-between">
            <Group>
              <option.icon />
              <Text>{option?.text}</Text>
            </Group>
          </Group>
        }
        onClick={() => navigate(option?.URL)}
        key={index}
      />
    );
  });

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
        <Group justify="space-between" w={"100%"}>
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
          {fullScreen && (
            <Tooltip label="Visualizar em tela cheia">
              <ActionIcon
                onClick={() => window.open("/ranking/full", "_blank")}
              >
                <ArrowsMaximize />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar className={classes.navbar}>
        <MantineAppShell.Section className={classes.section}>
          <Image src={logo} mah={"100%"} />
        </MantineAppShell.Section>

        <MantineAppShell.Section grow pt={"md"} h={"100%"}>
          {formattedOptions}

          {/* {options?.map((option) => (
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
          ))} */}
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
