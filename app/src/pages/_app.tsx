import Dashboard from "@/components/dashboard/Dashboard";
import "@/styles/globals.css";
import { Box } from "@mui/material";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Dashboard>
      <Box sx={{ paddingTop: "64px" }}>
        <Component {...pageProps} />
      </Box>
    </Dashboard>
  );
}
