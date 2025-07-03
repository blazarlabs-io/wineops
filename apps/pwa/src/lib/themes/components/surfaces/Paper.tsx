import { Components, Theme } from "@mui/material";

const MuiPaper: Components<Omit<Theme, "components">>["MuiPaper"] = {
  styleOverrides: {
    root: ({ theme }) => ({
      boxShadow: "none",
      border: "none",
      "&.MuiMenu-paper": {
        boxShadow: theme.shadows[8],
        border: `1px solid ${theme.palette.divider}`,
      },
      "&.MuiAutocomplete-paper": {
        boxShadow: theme.shadows[8],
        border: `1px solid ${theme.palette.divider}`,
      },
      "&.MuiDrawer-paper": {},
      "&.Popover-paper": {},
    }),
  },
};

export default MuiPaper;
