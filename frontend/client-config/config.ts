"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, hardhat } from "wagmi/chains";

const projectId = "CHAIN_CERT";

const isHardhat = process.env.NEXT_PUBLIC_BLOCKCHAIN === "hardhat";

export const config = getDefaultConfig({
  appName: "ChainCert",
  projectId,
  chains: [isHardhat ? hardhat : sepolia],
  ssr: true
});
