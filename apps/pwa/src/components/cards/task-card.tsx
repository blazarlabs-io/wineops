import { RIGHT_DRAWER_WIDTH } from "@/data/constants";
import { Box, Card, CardContent, Typography, Avatar } from "@mui/material";

export default function TaskCard() {
  return (
    <Card
      sx={{
        minWidth: 0,
        maxWidth: RIGHT_DRAWER_WIDTH - 32,
        borderRadius: 3,
        position: "relative",
        paddingLeft: "12px",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          className="w-3 h-full"
          sx={{
            backgroundColor: "primary.main",
            position: "absolute",
            left: 0,
            top: 0,
          }}
        />
        <Box display={"flex"} flexDirection={"column"} gap={2}>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Box display={"flex"} flexDirection={"column"} gap={0}>
              <Typography
                gutterBottom
                sx={{ color: "text.primary", fontSize: 14 }}
              >
                Task 1
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                className="truncate max-w-30"
              >
                Description goes here
              </Typography>
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"flex-end"}
              gap={0}
              justifyContent={"center"}
            >
              <Typography
                gutterBottom
                sx={{ color: "text.primary", fontSize: 14 }}
              >
                Assignee
              </Typography>
              <Box display={"flex"} alignItems={"center"} gap={1}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 24,
                    height: 24,
                  }}
                >
                  <Typography variant="body2">A</Typography>
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                  className="truncate"
                >
                  John Doe
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Box display={"flex"} flexDirection={"column"} gap={0}>
              <Typography
                gutterBottom
                sx={{ color: "text.primary", fontSize: 14 }}
              >
                Start Date
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                className="truncate"
              >
                2025-01-01
              </Typography>
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={0}
              alignItems={"flex-end"}
            >
              <Typography
                gutterBottom
                sx={{ color: "text.primary", fontSize: 14 }}
              >
                Due Date
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                className="truncate"
              >
                2025-01-01
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
