import { abi, contractAddress } from "@/const";
import { useMetaMask } from "@/hook";
import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useContractWrite } from "wagmi";
import { waitForTransaction } from "wagmi/actions";

export default function Mint() {
  const { address, isLogin } = useMetaMask();

  const {
    data: mint,
    write,
    isLoading: isMintLoading,
  } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "safeMint",
    args: [address, "http://MyNFT-Project.com/"],
    value: BigInt(0),
    onError: (e) => {
      console.log(e);
    },
  });

  const onMint = () => {
    write?.();
  };

  useEffect(() => {
    const getReceipt = async () => {
      const { hash } = mint! || {};
      const receipt = await waitForTransaction({ hash });
      if (receipt) {
        console.log(receipt);
      }
    };

    if (mint?.hash) {
      getReceipt();
    }
  }, [mint]);

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
        disabled={isMintLoading || !isLogin}
        onClick={onMint}
      >
        Mint
      </Button>
    </Box>
  );
}
