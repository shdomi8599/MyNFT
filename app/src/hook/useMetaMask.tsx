import { isLoginState, networkState } from "@/states";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { useAccount, useConnect, Connector, useBalance } from "wagmi";

export const useMetaMask = () => {
  const network = useRecoilValue(networkState);
  const [isLoading, setIsLoading] = useState(false);
  const isLogin = useRecoilValue(isLoginState);
  const { connectAsync, connectors } = useConnect();
  const { address } = useAccount();

  const { data: balance } = useBalance({
    address: address,
    watch: true,
  });

  // 메타마스크 커넥터 가져오기
  const connector = connectors.find(
    (connector: Connector) => connector.id === "metaMask"
  )!;

  // 로그인 상태라면 커넥트 실행
  useEffect(() => {
    if (isLogin) {
      connectAsync({ connector });
    }
  }, [isLogin]);

  // 계정에 이더가 없다면 1이더 보내주기
  useEffect(() => {
    if (address && balance?.value === BigInt(0)) {
      const giveEther = async () => {
        const privateKey = process.env.NEXT_PUBLIC_HARDHAT_SIGNER_PRIVATE_KEY;

        const client = createWalletClient({
          chain: hardhat,
          transport: http(),
        });

        const account = privateKeyToAccount(`0x${privateKey}`);

        await client.sendTransaction({
          account,
          to: address,
          value: parseEther("1"),
        });
      };

      giveEther();
    }
  }, [address]);

  return {
    isLogin,
    address,
    balance,
    isLoading,
    setIsLoading,
    network,
  };
};
