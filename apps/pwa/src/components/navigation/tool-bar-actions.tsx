/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/lib/firebase/auth";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { ThemeSwitcher } from "@toolpad/core/DashboardLayout";
import { useState } from "react";

export type ToolBarActionsProps = {
  props?: any;
};

const settings = ["Logout"];

export default function ToolBarActions({ props }: ToolBarActionsProps) {
  const { user, signOut } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = async (item: string) => {
    if (item === "Logout") {
      console.log("signing out");
      await signOut();
      setAnchorElUser(null);
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in";
      }
    }
  };

  return (
    <Box display={"flex"} alignItems={"center"} gap={1} sx={{ flexGrow: 0 }}>
      <ThemeSwitcher />

      {user ? (
        <>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              {user?.photoURL ? (
                <Avatar alt="Remy Sharp" src={user.photoURL} />
              ) : (
                <Avatar alt="Remy Sharp">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                </Avatar>
              )}
            </IconButton>
          </Tooltip>

          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem
                key={setting}
                onClick={handleCloseUserMenu}
                onClickCapture={() => handleMenuItemClick(setting)}
              >
                <Typography sx={{ textAlign: "center" }}>{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </>
      ) : (
        <Button
          variant="contained"
          sx={{ cursor: "pointer" }}
          onClick={() => {
            if (typeof window !== "undefined") {
              window.location.href = "/sign-in";
            }
          }}
        >
          Sign in
        </Button>
      )}
    </Box>
  );
}
