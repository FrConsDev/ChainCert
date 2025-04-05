import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ChainCertModule = buildModule("ChainCertModule", (m) => {
  const chainCert = m.contract("ChainCert");

  const owner = m.getAccount(0);

  for (let i = 0; i < 3; i++) {
    const serialNumber = `SN-${Date.now()}-${i}`;
    const publicId = `PID-${Date.now()}-${i}`;
    
    const uniqueId = `mintProductDate${Date.now()}Count${i}`;
    const metadataURI = 'bafkreicqrutbejnu273znextky4xltyyy35jxwyiuwo2i57nih25cn7pgi';

    console.log(`Serial Number: ${serialNumber}, Public ID: ${publicId}`);

    m.call(chainCert, "mintProduct", [owner, metadataURI, serialNumber, publicId], {
      from: owner,
      id: uniqueId,
    });
  }

  return { chainCert };
});

export default ChainCertModule;
