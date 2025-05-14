"use client";

import PublicLayout from "@/components/layout/public-layout";
import { useAuth } from "@/lib/firebase/auth";
import { Box, Button, Typography } from "@mui/material";

export default function Home() {
  const { user } = useAuth();

  const handleGoToWorkspace = () => {
    if (typeof window !== "undefined") window.location.href = "/workspace";
  };

  return (
    <PublicLayout>
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyItems={"center"}
      >
        <Typography variant="h2">Hello world</Typography>
        {user && (
          <Box display={"flex"} flexDirection={"column"} gap={4}>
            <Typography variant="body1">
              Signed in as: <b>{user.email}</b>
            </Typography>
            <Button
              size="large"
              variant="outlined"
              color="primary"
              onClick={handleGoToWorkspace}
            >
              My Workspace
            </Button>
          </Box>
        )}
      </Box>
    </PublicLayout>
  );
}
