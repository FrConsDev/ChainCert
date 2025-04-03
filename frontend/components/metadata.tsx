import { ipfsToHttp } from "@/client-config/ipfs";
import { Metadata } from "@/interface/metadata";
import Image from "next/image";

export const MetadataComponent = (prodcutMetadata: Metadata) => {
    return (
        <>
    {prodcutMetadata ? (
        <div>
            <p><strong>Nom:</strong> {prodcutMetadata.name}</p>
            <p><strong>Description:</strong> {prodcutMetadata.description}</p>
            { <Image src={ipfsToHttp(prodcutMetadata.image)} alt={prodcutMetadata.description}
             className="w-32 h-32 object-cover rounded-md" width={45} height={45} /> }
        </div>
    ) : (
        <p className="text-gray-500">An error occured...</p>
    )}
    </>
  );
};