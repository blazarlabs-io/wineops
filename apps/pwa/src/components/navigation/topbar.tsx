import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ToolBarActions from "./tool-bar-actions";

export default function Topbar() {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container
        maxWidth="xl"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              //   fontFamily: "monospace",
              fontWeight: 700,
              //   letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            WineOps
          </Typography>
          {/* TODO: An other items or links go here */}
        </Toolbar>
        <ToolBarActions props={{}} />
      </Container>
    </AppBar>
  );
}
