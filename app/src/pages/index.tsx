import { isLoginState, networkState } from "@/states";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { ChangeEvent, useEffect } from "react";
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

  // 선택된 네트워크 상태
  const [network, seNewtwork] = useRecoilState(networkState);
  const handleNetwork = (event: ChangeEvent<HTMLInputElement>) => {
    seNewtwork(event.target.value);
  };

  // 로그인 상태
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);

  useEffect(() => {
    if (isLogin && !isConnected) {
      connectAsync({ connector });
    }
  }, [isLogin, isConnected]);

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

      setIsLogin(false);

      return disconnect();
    }
  };

  const switchNetwork = async (chainId: number) => {
    try {
      // 네트워크 변경
      await window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(chainId) }],
      });

      // 로그인 상태 변경
      setIsLogin(true);

      // 서명
      await sign();
    } catch (e) {
      console.log(e);

      return disconnect();
    }
  };

  const handleConnect = async (connector: Connector<any, any>) => {
    if (!connector.ready) {
      return window.open("https://metamask.io/download/", "_blank");
    }

    try {
      // 연결
      const data = await connectAsync({ connector });

      if (data.chain.id !== 31337 || 5) {
        if (network === "hardhat") {
          return await switchNetwork(31337);
        }

        if (network === "goerli") {
          return await switchNetwork(5);
        }
      }

      // 로그인 상태 변경
      setIsLogin(true);

      // 서명
      await sign();
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
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Network</FormLabel>
        <RadioGroup
          defaultValue="hardhat"
          onChange={handleNetwork}
          value={network}
        >
          <FormControlLabel
            value={"hardhat"}
            disabled={isDisabled}
            control={<Radio />}
            label="Hardhat"
          />
          <FormControlLabel
            value="goerli"
            disabled={isDisabled}
            control={<Radio />}
            label="Goerli"
          />
        </RadioGroup>
      </FormControl>
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
