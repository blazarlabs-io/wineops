import { Components, Theme } from "@mui/material";

const MuiFab: Components<Omit<Theme, "components">>["MuiFab"] = {
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

export default MuiFab;
