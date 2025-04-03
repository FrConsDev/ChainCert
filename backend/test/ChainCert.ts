import { expect } from "chai";
import { ethers, network } from "hardhat";
import { ChainCert } from "../typechain-types";
import { HDNodeWallet, randomBytes } from "ethers";

async function connectRandomSigner() {
  const randomSigner = ethers.Wallet.createRandom().connect(ethers.provider);

  await network.provider.send("hardhat_setBalance", [
    randomSigner.address,
    "0x56BC75E2D63100000"
  ]);

  return randomSigner;
}

describe("ChainCert", function () {
  let signer1: HDNodeWallet;
  let contract: ChainCert;

  const serialNumber = "SN-1-1";
  const publicId = "PID-1-1";
  const metadataURI = "ipfs://example_metadata_SN-1-1";
  const enterprise = ethers.Wallet.createRandom();

  before(async function () {
    signer1 = await connectRandomSigner();
  });

  beforeEach(async function () {
    contract = await ethers.deployContract("ChainCert");
  });

  async function mintTestProduct(more = 0) {
    const testTx = await contract.mintProduct(
      enterprise,
      metadataURI,
      more !== 0 ? `${serialNumber}-${more}` : serialNumber,
      more !== 0 ? `${publicId}-${more}` : publicId
    );

    return testTx;
  }

  async function claimTestProduct(clamingSerialNumber = serialNumber) {
    const testTx = await contract.connect(signer1).claimProduct(clamingSerialNumber);

    return testTx;
  }

  describe("Minting Products", function () {
    it("should mint and emit a mint event correctly", async function () {
      await expect(contract.mintProduct(enterprise, metadataURI, serialNumber, publicId))
      .to.emit(contract, 'ProductMinted').withArgs(enterprise, 1, metadataURI, serialNumber, publicId);
    });

    it("should revert because of duplicate serial number", async function () {
      await mintTestProduct();
      await expect(contract.mintProduct(enterprise, metadataURI, serialNumber, publicId))
      .to.be.revertedWith("Product already registered");
    });

    // A VOIR COMMENT FONT LES CONCURRENTS car un id public peut ne pas etre aleatoire
    it("should revert because of duplicate publicId", async function () {
      await mintTestProduct();
      await expect(contract.mintProduct(enterprise, metadataURI, 'serialNumber', publicId))
      .to.be.revertedWith("PublicId already used");
    });

    it("should revert because only owner can mint", async function () {
      await expect(contract.connect(signer1).mintProduct(enterprise, metadataURI, serialNumber, publicId))
      .to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount")
    });
  });

  describe("Claiming Products", function () {
    it("should allow a user to claim a product", async function () {
      await mintTestProduct();
      await expect(contract.connect(signer1).claimProduct(serialNumber)).to.emit(contract, 'ProductClaimed')
        .withArgs(signer1.address, 1, serialNumber, publicId, metadataURI, true);
    });

    it("should revert because product doesnt exist", async function () {
      await mintTestProduct();
      await expect(contract.connect(signer1).claimProduct('serialNumber'))
      .to.be.revertedWith("Product not found");
    });

    it("should revert because product is already claimed", async function () {
      await mintTestProduct();
      await claimTestProduct();
      await expect(contract.connect(signer1).claimProduct(serialNumber))
      .to.be.revertedWith("Product already claimed");
    });
  });

  describe("Retrieve Products", function () {
    it("should product details", async function () {
      await mintTestProduct();
      const productDetails = await contract.connect(signer1).getProductDetailsByPublicId(publicId);

      expect(productDetails.serialNumber).to.equal(serialNumber);
      expect(productDetails.publicId).to.equal(publicId);
      expect(productDetails.metadataURI).to.equal(metadataURI);
      expect(productDetails.enterprise).to.equal(enterprise);
      expect(productDetails.isClaimed).to.equal(false);
    });

    it("should revert because product doesnt exist", async function () {
      await mintTestProduct();
      await expect(contract.connect(signer1).getProductDetailsByPublicId('publicId'))
      .to.be.revertedWith("Product not found");
    });

    it("should allow user to retrieve their product", async function () {
      await mintTestProduct();
      await claimTestProduct();
      await mintTestProduct(1);
      await claimTestProduct(serialNumber.concat('-1'));

      const productOwner = await contract.connect(signer1).getProductsByOwner();
      expect(productOwner).length(2);
      expect(productOwner[0].serialNumber).to.equal(serialNumber);
      expect(productOwner[0].publicId).to.equal(publicId);
      expect(productOwner[0].metadataURI).to.equal(metadataURI);
      expect(productOwner[0].enterprise).to.equal(enterprise);
      expect(productOwner[0].isClaimed).to.equal(true);
      expect(productOwner[1].serialNumber).to.equal(serialNumber.concat('-1'));
      expect(productOwner[1].publicId).to.equal(publicId.concat('-1'));
      expect(productOwner[1].metadataURI).to.equal(metadataURI);
      expect(productOwner[1].enterprise).to.equal(enterprise);
      expect(productOwner[1].isClaimed).to.equal(true);
    });

    
    it("should not retrieve not owned product", async function () {
      await mintTestProduct();
      await claimTestProduct();
      await mintTestProduct(1);
      await claimTestProduct(serialNumber.concat('-1'));
      await mintTestProduct(2);

      const newRandomSigner = await connectRandomSigner();
      await contract.connect(newRandomSigner).claimProduct(serialNumber.concat('-2'));

      const productOwner = await contract.connect(newRandomSigner).getProductsByOwner();
      expect(productOwner).length(1);

    });

    it("should revert because any product is owned", async function () {
      await mintTestProduct();
      await expect(contract.connect(signer1).getProductsByOwner()).to.be.revertedWith("You dont own any product");
    });
  });
});
