import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ChainCertModule = buildModule("ChainCertModule", (m) => {
  const chainCert = m.contract("ChainCert");

  const enterprises: string[] = [
    "0x1234567890123456789012345678901234567890",
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  ];

  const owner = m.getAccount(0);

  for (let i = 0; i < 3; i++) {
    const serialNumber = `SN-${i}-${i}`;
    const publicId = `PID-${i}-${i}`;
    const metadataURI = 'bafkreicqrutbejnu273znextky4xltyyy35jxwyiuwo2i57nih25cn7pgi';
    const uniqueId = `mintProduct${i+1}`;

    m.call(chainCert, "mintProduct", [enterprises[i % 2], metadataURI, serialNumber, publicId], {
      from: owner,
      id: uniqueId,
    });
  }

  return { chainCert };
});

export default ChainCertModule;
