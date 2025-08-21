import { ethers } from "ethers";

export const GetSigner = async () => {
  try {
    const account = (window as any).ethereum;

    if (!account) {
      alert("Please, connect your wallet!");
      return;
    }

    const provider = new ethers.BrowserProvider(account);

    const signer = await provider.getSigner();

    return signer;
  } catch (e: any) {
    console.log("[ERROR ON GET SIGNER]: ", e);
    return null;
  }
};
