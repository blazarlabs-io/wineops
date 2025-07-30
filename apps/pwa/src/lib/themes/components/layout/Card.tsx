import { Components, Theme } from "@mui/material";

const MuiCard: Components<Omit<Theme, "components">>["MuiCard"] = {
  defaultProps: {},
  styleOverrides: {
    root: ({ theme }) => ({
      background: "transparent",
    }),
  },
};

export default MuiCard;
