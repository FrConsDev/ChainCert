"use client";
import React, { useState } from 'react'
import { Button } from './ui/button'
import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants';
import { Input } from './ui/input';
import { Product } from '@/interface/product';
import { useFetchMetadata } from '@/services/fetch-metadata';

const ProductDetailsComponent = () => {
  const [inputAddress, setInputAddress] = useState("");
  const [claimedProduct, setClaimedProduct] = useState<Product | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: product, error, isError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getProductDetailsByPublicId",
    args: inputAddress ? [inputAddress] : undefined,
  });

    //  const metadataList = useFetchMetadata(
    //       product ? product.map(({ publicId, metadataURI }) => ({ publicId, metadataURI })) : []
    //   );

  const handleClaim = async () => {
    if (!inputAddress) {
      setErrorMessage("Veuillez entrer un identifiant public.");
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (product) {
        setClaimedProduct(product as Product);
      } else {
        setErrorMessage("Product not found");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occured");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-5 p-5 gap-5 w-full max-w-screen-lg mx-auto">
      <Input
        type="string"
        id="address"
        placeholder="Bar code or public ID"
        onChange={(e) => setInputAddress(e.target.value)}
      />
      <Button
        onClick={handleClaim}
        disabled={isLoading || !inputAddress}
        className="bg-[#212F3C] w-full mt-4"
      >
        {isLoading ? <span style={{ color: "white" }}>Loading...</span> : <span style={{ color: "white" }}>Get details</span>}
      </Button>

      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      {claimedProduct && !errorMessage && (
        <div>
          <h2>Détails du produit</h2>
          <p><strong>Numéro de série:</strong> {claimedProduct.serialNumber}</p>
          <p><strong>Identifiant public:</strong> {claimedProduct.publicId}</p>
          <p><strong>Entreprise:</strong> {claimedProduct.enterprise}</p>
          <p><strong>Revendiqué:</strong> {claimedProduct.isClaimed ? "Yes" : "No"}</p>
        </div>
      )}

      {isError && !claimedProduct && <p className="text-red-500 mt-2">Error: {error?.message}</p>}
    </div>
  )
}

export default ProductDetailsComponent;
