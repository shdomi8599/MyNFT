import Dashboard from "@/components/dashboard/Dashboard";
import "@/styles/globals.css";
import { Box } from "@mui/material";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { hardhat, goerli } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

export default function App({ Component, pageProps }: AppProps) {
  const { chains, publicClient } = configureChains(
    [hardhat, goerli],
    [
      jsonRpcProvider({
        rpc: (chain) => ({
          http:
            chain.id === 5
              ? "https://eth-goerli.g.alchemy.com/v2/XCt-P3uDrr8dOFY6qn9vftrQ--p2PEO4"
              : "http://localhost:8545/",
        }),
      }),
    ]
  );

  const config = createConfig({
    connectors: [new MetaMaskConnector({ chains })],
    publicClient,
  });

  return (
    <RecoilRoot>
      <WagmiConfig config={config}>
        <Dashboard>
          <Box sx={{ paddingTop: "64px" }}>
            <Component {...pageProps} />
          </Box>
        </Dashboard>
      </WagmiConfig>
    </RecoilRoot>
  );
}
