import { Components, Theme } from "@mui/material";

const MuiStack: Components<Omit<Theme, "components">>["MuiStack"] = {
  defaultProps: {
    useFlexGap: true,
  },
  styleOverrides: {
    root: ({ theme }) => ({}),
  },
};

export default MuiStack;
