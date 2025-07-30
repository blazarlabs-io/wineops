import { Components, Theme } from "@mui/material/styles";
import { LinkBehavior } from "./LinkBehavior";

const MuiLink: Components<Theme>["MuiLink"] = {
  defaultProps: {
    underline: "none",
    component: LinkBehavior,
  },
  styleOverrides: {
    root: ({ theme }) => {
      return {
        textDecoration: "none",
        fontSize: theme.typography.caption.fontSize,
        "&:hover": {
          textDecoration: "none",
          color: theme.palette.primary.dark,
        },
      };
    },
  },
};

export default MuiLink;
