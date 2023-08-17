import { abi, goerliContractAddress, hardhatContractAddress } from "@/const";
import { useMetaMask } from "@/hook";
import { networkState } from "@/states";
import { Box, Button, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useContractWrite } from "wagmi";
import { waitForTransaction } from "wagmi/actions";

export default function Mint() {
  const { address, isLogin, isLoading, setIsLoading } = useMetaMask();
  const network = useRecoilValue(networkState);

  const {
    data: mint,
    write,
    isLoading: isMintLoading,
  } = useContractWrite({
    address:
      network === "hardhat" ? hardhatContractAddress : goerliContractAddress,
    abi,
    functionName: "safeMint",
    args: [address, "http://MyNFT-Project.com/"],
    value: BigInt(0),
    onError: (e) => {
      console.log(e);
    },
  });

  const isBtnDisabled = isMintLoading || !isLogin || isLoading;

  const onMint = () => {
    setIsLoading(true);
    write?.();
  };

  useEffect(() => {
    const getReceipt = async () => {
      try {
        const { hash } = mint! || {};

        const receipt = await waitForTransaction({ hash });

        console.log(receipt);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    if (mint?.hash) {
      getReceipt();
    }
  }, [mint]);

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
          disabled={isBtnDisabled}
          onClick={onMint}
        >
          Mint
        </Button>
      </Box>
    </>
  );
}
