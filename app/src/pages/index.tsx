import { Box, Button } from "@mui/material";

export default function Home() {
  return (
    <Box
      sx={{
        height: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        sx={{ width: "15%", height: "10%", fontSize: "1.5rem" }}
        variant="contained"
      >
        Connect Wallet
      </Button>
    </Box>
  );
}
