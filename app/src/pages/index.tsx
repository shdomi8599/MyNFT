import { isLoginState } from "@/states";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { toHex } from "viem/utils";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { Connector } from "wagmi/connectors";
import { useRecoilState } from "recoil";

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function Home() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { isLoading, connectAsync, connectors } = useConnect();

  // hardhat 네트워크 상태
  const [isHardhat, setisHardhat] = useState(false);

  // 로그인 상태
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);

  useEffect(() => {
    if (isLogin && !isConnected) {
      connectAsync({ connector });
    }
  }, [isLogin]);

  // 메타마스크 커넥터 가져오기
  const connector = connectors.find(
    (connector: Connector) => connector.id === "metaMask"
  )!;

  // 버튼 비활성화
  const isDisabled = isLoading || isConnected;

  const sign = async () => {
    try {
      // 메세지 + 서명
      await signMessageAsync({ message: "hello" });
    } catch (e) {
      console.log(e);

      disconnect();
    }
  };

  const switchNetwork = async (chainId: number) => {
    try {
      // 네트워크 변경
      await window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(chainId) }],
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleConnect = async (connector: Connector<any, any>) => {
    if (!connector.ready) {
      return window.open("https://metamask.io/download/", "_blank");
    }

    try {
      // 연결
      const data = await connectAsync({ connector });

      if (data.chain.id !== 31337) {
        try {
          // 네트워크 변경
          await switchNetwork(31337).then(() => setisHardhat(true));
        } catch (e) {
          disconnect();

          return alert("Please change network to hardhat");
        }
      }

      if (isHardhat || data.chain.id === 31337) {
        // 서명
        await sign();

        // 로그인 상태 변경
        return setIsLogin(true);
      }

      // 위의 조건에 맞지 않다면 연결 해제
      return disconnect();
    } catch (e) {
      console.log(e);

      // 실패 시, 연결 해제
      disconnect();
    }
  };

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
        sx={{ width: "15%", height: "10%", fontSize: "1rem" }}
        variant="contained"
        disabled={isDisabled}
        onClick={() => handleConnect(connector)}
      >
        {!isDisabled ? "Connect Wallet" : "Connected"}
      </Button>
    </Box>
  );
}
