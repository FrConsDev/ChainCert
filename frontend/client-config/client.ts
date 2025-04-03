import { createPublicClient, http } from "viem";
import { sepolia, hardhat } from "wagmi/chains";

export function getConfigForClient() {
  const isHardhat = process.env.NEXT_PUBLIC_BLOCKCHAIN === "hardhat";
  const chain = isHardhat ? hardhat : sepolia;

  return {
    chain: chain,
    transport: http(),
  };
}

export const publicClient = createPublicClient(getConfigForClient());
