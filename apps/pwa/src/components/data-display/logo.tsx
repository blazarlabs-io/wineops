import { useSidebar } from "@/context/sidebar";
import { MenuOpen } from "@mui/icons-material";
import { Chip, IconButton, Stack, useColorScheme } from "@mui/material";
import Image from "next/image";

export default function Logo() {
  const { openSidebar, updateOpenSidebar } = useSidebar();
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const handleSidebarCollapse = () => {
    updateOpenSidebar(false);
  };

  const handleSidebarExpand = () => {
    updateOpenSidebar(true);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {!openSidebar ? (
        <IconButton size="small" onClick={handleSidebarExpand}>
          <MenuOpen className="rotate-180" />
        </IconButton>
      ) : (
        <IconButton size="small" onClick={handleSidebarCollapse}>
          <MenuOpen className="" />
        </IconButton>
      )}

      <Stack direction="row" alignItems="center" spacing={1}>
        {}
        <Image
          src={isDarkMode ? "/images/logo-dark.png" : "/images/logo-light.png"}
          alt="WineOps"
          height={48}
          width={150}
        />
      </Stack>
      <Chip
        size="small"
        label="BETA"
        color="info"
        variant={isDarkMode ? "outlined" : "filled"}
      />
      {}
    </Stack>
  );
}
