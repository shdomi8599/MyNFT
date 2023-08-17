import { abi, contractAddress } from "@/const";
import { useMetaMask } from "@/hook";
import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useContractWrite } from "wagmi";
import { waitForTransaction } from "wagmi/actions";

export default function Burn() {
  const { isLogin } = useMetaMask();

  const {
    data: burn,
    write,
    isLoading: isBurnLoading,
  } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "burn",
    args: [BigInt(1)],
    onError: (e) => {
      console.log(e);
    },
  });

  const onBurn = () => {
    write?.();
  };

  useEffect(() => {
    const getReceipt = async () => {
      const { hash } = burn! || {};
      const receipt = await waitForTransaction({ hash });
      if (receipt) {
        console.log(receipt);
      }
    };

    if (burn?.hash) {
      getReceipt();
    }
  }, [burn]);

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
        disabled={isBurnLoading || !isLogin}
        onClick={onBurn}
      >
        Burn
      </Button>
    </Box>
  );
}
