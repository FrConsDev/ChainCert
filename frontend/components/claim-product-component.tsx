"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useWriteContract } from "wagmi";
import { parseAbiItem} from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants";
import { Input } from "./ui/input";
import { publicClient } from "@/client-config/client";
import { Product } from "@/interface/product";

const ClaimProductComponent = () => {
  const [inputAddress, setInputAddress] = useState("");
  const [claimedProduct, setClaimedProduct] = useState<Product | null>(null);

  const { data, error, isPending, writeContract } = useWriteContract();

  const handleClaim = async () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "claimProduct",
      args: [inputAddress],
    });
  };

  useEffect(() => {
    const fetchClaimedProducts = async () => {
      if (!data) return;
       
      try {
        const claimedEvents = await publicClient.getLogs({
          address: CONTRACT_ADDRESS,
          event: parseAbiItem("event ProductClaimed(address indexed buyer, uint256 indexed tokenId, string serialNumber, string publicId, string metadataURI, bool isClaimed)"),
          fromBlock: BigInt(0),
          toBlock: "latest",
        });

        

        console.log("claimedEvents =========", claimedEvents);
        if (claimedEvents.length > 0) {
          const { args } = claimedEvents[claimedEvents.length - 1]; // Dernier événement émis
          console.log("args =========", args);
          setClaimedProduct({
            publicId: args.publicId || 'An error occured',
            serialNumber: args.serialNumber || 'An error occured',
            metadataURI: args.metadataURI|| 'An error occured',
            isClaimed: true,
          });
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des logs:", err);
      }
    };

    fetchClaimedProducts();
  }, [data]);

  return (
    <div className="flex flex-col items-center space-y-5 p-5 gap-5 w-full max-w-screen-lg mx-auto">
      <Input
        type="string"
        id="address"
        placeholder="Serial number"
        onChange={(e) => setInputAddress(e.target.value)}
      />
      <Button
        onClick={handleClaim}
        disabled={isPending || !inputAddress}
        className="bg-[#212F3C] w-full mt-4"
      >
        {isPending ? <span className="text-white">Loading...</span> : <span className="text-white">Claim my product</span>}
      </Button>
      {error && <p className="text-red-500 mt-2">Error : {error.message}</p>}
      {claimedProduct && (
        <div>
          <h2>Congratulations, you are the owner of:</h2>
          <p><strong>Serial:</strong> {claimedProduct.serialNumber}</p>
          <p><strong>Metadata:</strong> {claimedProduct.metadataURI}</p>
        </div>
      )}
    </div>
  );
};

export default ClaimProductComponent;
