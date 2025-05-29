import { createTheme } from "@mui/material/styles";
import typography from "./typography";
import MuiFab from "./components/buttons/Fab";
import MuiButton from "./components/buttons/Button";
import MuiStack from "./components/layout/Stack";
import MuiPaper from "./components/surfaces/Paper";
import MuiCard from "./components/layout/Card";

export const mainTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
  typography,
  components: {
    MuiButton,
    MuiFab,
    MuiPaper,
    MuiStack,
    MuiCard,
  },
});
