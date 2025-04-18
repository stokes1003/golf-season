import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import { QueryProvider } from "./providers/QueryProvider";

const theme = createTheme({
  primaryColor: "blue",
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryProvider>
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </QueryProvider>
  </StrictMode>
);
