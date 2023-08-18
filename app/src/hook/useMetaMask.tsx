import { isLoginState, networkState } from "@/states";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
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
      const hardhatWallet = new ethers.Wallet(
        process.env.NEXT_PUBLIC_HARDHAT_SIGNER_PRIVATE_KEY as string
      );

      const provider = new ethers.providers.JsonRpcProvider(
        "http://localhost:8545/"
      );

      const walletWithProvider = hardhatWallet.connect(provider);

      walletWithProvider.sendTransaction({
        to: address,
        value: ethers.utils.parseEther("1"),
      });
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
