import { abi, goerliContractAddress, hardhatContractAddress } from "@/const";
import { useMetaMask } from "@/hook";
import { Box, Button, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useContractWrite } from "wagmi";
import { waitForTransaction } from "wagmi/actions";

export default function Burn() {
  const { isLogin, isLoading, setIsLoading, network } = useMetaMask();

  const {
    data: burn,
    write,
    isLoading: isBurnLoading,
  } = useContractWrite({
    address:
      network === "hardhat" ? hardhatContractAddress : goerliContractAddress,
    abi,
    functionName: "burn",
    args: [BigInt(1)],
    onError: (e) => {
      console.log(e);
    },
  });

  const onBurn = () => {
    setIsLoading(true);
    write?.();
  };

  useEffect(() => {
    const getReceipt = async () => {
      try {
        const { hash } = burn! || {};

        const receipt = await waitForTransaction({ hash });

        console.log(receipt);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    if (burn?.hash) {
      getReceipt();
    }
  }, [burn]);

  return (
    <>
      {isLoading && (
        <Box sx={{ position: "absolute", top: "48.5%", left: "50.5%" }}>
          <CircularProgress />
        </Box>
      )}
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
    </>
  );
}
