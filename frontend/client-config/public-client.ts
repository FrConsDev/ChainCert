import { createPublicClient, http, PublicClient } from "viem";
import { hardhat, sepolia } from "viem/chains";

let publicClient: PublicClient;

if (process.env.NEXT_PUBLIC_BLOCKCHAIN === 'hardhat') {
  
  publicClient = createPublicClient({ 
    chain: hardhat,
    transport: http()
  });
  
} else {

  publicClient = createPublicClient({ 
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCH_KEY}`)
  });

}


export { publicClient }