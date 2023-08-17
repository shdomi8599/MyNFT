import Dashboard from "@/components/dashboard/Dashboard";
import { ALCHEMY_ID } from "@/const";
import "@/styles/globals.css";
import { Box } from "@mui/material";
import type { AppProps } from "next/app";
import { QueryClientProvider, QueryClient } from "react-query";
import { RecoilRoot } from "recoil";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { hardhat } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const { chains, publicClient } = configureChains(
    [hardhat],
    [
      jsonRpcProvider({
        rpc: () => ({
          http: "http://localhost:8545/",
        }),
      }),
      alchemyProvider({ apiKey: ALCHEMY_ID }),
    ]
  );

  const config = createConfig({
    connectors: [new MetaMaskConnector({ chains })],
    publicClient,
  });

  return (
    <RecoilRoot>
      <WagmiConfig config={config}>
        <QueryClientProvider client={queryClient}>
          <Dashboard>
            <Box sx={{ paddingTop: "64px" }}>
              <Component {...pageProps} />
            </Box>
          </Dashboard>
        </QueryClientProvider>
      </WagmiConfig>
    </RecoilRoot>
  );
}
