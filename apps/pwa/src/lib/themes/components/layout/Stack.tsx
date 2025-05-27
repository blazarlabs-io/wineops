import { Components, Theme } from "@mui/material";

const MuiStack: Components<Omit<Theme, "components">>["MuiStack"] = {
  defaultProps: {
    useFlexGap: true,
    lineHeight: 1,
  },
  styleOverrides: {
    root: ({ theme }) => ({}),
  },
};

export default MuiStack;
