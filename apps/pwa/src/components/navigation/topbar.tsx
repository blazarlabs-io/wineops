import { Stack, useColorScheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Image from "next/image";
import ToolBarActions from "./tool-bar-actions";

export default function Topbar() {
  const { colorScheme } = useColorScheme();

  return (
    <AppBar
      suppressHydrationWarning
      position="static"
      color="transparent"
      elevation={0}
    >
      <Container
        maxWidth="xl"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Toolbar disableGutters>
          <Stack direction="row" alignItems="center" spacing={1}>
            {/* <Hub fontSize="medium" color="primary" />
        <Typography variant="h6">WineOps</Typography> */}
            <Image
              src={
                colorScheme === "dark"
                  ? "/images/logo-dark.png"
                  : "/images/logo-light.png"
              }
              alt="WineOps"
              height={48}
              width={150}
            />
          </Stack>
        </Toolbar>
        <ToolBarActions props={{}} />
      </Container>
    </AppBar>
  );
}
