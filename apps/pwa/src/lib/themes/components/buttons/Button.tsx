import { Components, Theme } from "@mui/material";

const MuiButton: Components<Omit<Theme, "components">>["MuiButton"] = {
  defaultProps: {},
  styleOverrides: {
    root: ({ theme }) => ({
      minWidth: "40px",
      boxShadow: "none",
      zIndex: theme.zIndex.drawer - 1,
      "&:hover": {
        boxShadow: "none",
      },
    }),
  },
};

export default MuiButton;
