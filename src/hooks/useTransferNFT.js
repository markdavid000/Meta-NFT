import { useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import { isSupportedChain } from "../utils";
import { id, isAddress } from "ethers";
import { getProvider } from "../constants/providers";
import { mintNFT } from "../constants/contracts";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";

const useTransfer = (address, id) => {
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  return useCallback(async () => {
    if (!isSupportedChain(chainId)) return toast.error("Wrong network");
    if (!isAddress(address)) return toast.error("Invalid address");
    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();

    const contract = mintNFT(signer);

    try {
      const transaction = await contract.transferFrom(
        signer.address,
        address,
        id
      );
      console.log("transaction: ", transaction);

      const receipt = await transaction.wait();
      console.log("receipt: ", receipt);

      if (receipt.status) {
        return toast.success("Transfer successful!");
      }

      toast.error("Transfer failed!");
    } catch (error) {
      console.error("error: ", error);
    }
  }, [address, id, chainId, walletProvider]);
};

export default useTransfer;
