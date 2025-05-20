import { Components, Theme } from "@mui/material";

const MuiPaper: Components<Omit<Theme, "components">>["MuiPaper"] = {
  styleOverrides: {
    root: ({ theme }) => ({
      boxShadow: "none",
      border: "none",
      "&.MuiMenu-paper": {},
      "&.MuiDrawer-paper": {},
      "&.Popover-paper": {},
    }),
  },
};

export default MuiPaper;
