import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "normalize.css";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./theme.ts";
import "./assets/fonts/fonts.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <App />
    </ChakraProvider>
  </StrictMode>
);
