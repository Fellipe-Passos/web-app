import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./routes/index.ts";
import { MantineProvider } from "@mantine/core";
import { theme } from "./styles/theme.ts";
import { QueryClient, QueryClientProvider } from "react-query";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import { AppShell } from "./components/AppShell/index.tsx";
import { Notifications } from "@mantine/notifications";

const r = routes?.map((route) => ({
  path: route?.path,
  element: route?.isPrivate ? (
    <AppShell pageTitle={route?.title ?? ""} returnButton={route?.returnButton}>
      {route?.element}
    </AppShell>
  ) : (
    route?.element
  ),
}));
const router = createBrowserRouter(r);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Notifications position="top-right" />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>
);
