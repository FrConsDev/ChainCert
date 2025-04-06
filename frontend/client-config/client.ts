import { createPublicClient, http } from "viem";
import { sepolia, hardhat } from "wagmi/chains";

export function getConfigForClient() {
  const isHardhat = process.env.NEXT_PUBLIC_BLOCKCHAIN === "hardhat";
  const chain = isHardhat ? hardhat : sepolia;

  return {
    chain: chain,
    transport: http(isHardhat ? "" : "https://sepolia.infura.io/v3/46f11c834c26481296d7bd2e2ff8e2f6"),
  };
}

export const publicClient = createPublicClient(getConfigForClient());
