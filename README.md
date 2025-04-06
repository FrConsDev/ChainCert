# ChainCert
RS6515 certification "Blockchain Developer" repository, for the project "CHAINCERT"

Version
=======
> solidity-coverage: v0.8.14

Instrumenting for coverage...
=============================

> ChaintCert.sol

Compilation:
============

Generating typings for: 8 artifacts in dir: typechain-types for target: ethers-v6
Successfully generated 34 typings!
Compiled 7 Solidity files successfully (evm target: paris).

Network Info
============
> HardhatEVM: v2.22.19
> network:    hardhat



  ChainCert
    ✔ should remove for sales if transfered (189ms)
    ✔ should revert if transfer fails using call (143ms)
    Minting Products
      ✔ should mint and emit a mint event correctly
      ✔ should revert because of duplicate serial number
      ✔ should revert because of duplicate publicId
      ✔ should revert because only owner can mint
    Claiming Products
      ✔ should allow a user to claim a product (106ms)
      ✔ should revert because product doesnt exist
      ✔ should revert because product is already claimed (122ms)
    Retrieve Products
      ✔ should product details
      ✔ should product details with serial number
      ✔ should revert because product doesnt exist
      ✔ should allow user to retrieve their product (222ms)
      ✔ should not retrieve not owned product (305ms)
      ✔ should revert because any product is owned
    Listing Products for Sale
      ✔ should allow the owner to list a product for sale (117ms)
      ✔ should revert because the caller is not the owner
      ✔ should revert because product not exist (105ms)
      ✔ should revert because the price is zero (109ms)
    Buying a Product
      ✔ should allow a user to buy a product (232ms)
      ✔ should revert because the product is not for sale
      ✔ should revert because the product doest not exist
      ✔ should revert because the buyer does not have enough funds (121ms)
      ✔ should revert because the buyer is the owner of the product (109ms)
      ✔ should transfer the product correctly to the buyer (210ms)
      ✔ should move the last token when a non-last token is removed (445ms)


  26 passing (3s)

-----------------|----------|----------|----------|----------|----------------|
File             |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-----------------|----------|----------|----------|----------|----------------|
 contracts\      |      100 |    89.58 |      100 |      100 |                |
  ChaintCert.sol |      100 |    89.58 |      100 |      100 |                |
-----------------|----------|----------|----------|----------|----------------|
All files        |      100 |    89.58 |      100 |      100 |                |
-----------------|----------|----------|----------|----------|----------------|

> Istanbul reports written to ./coverage/ and ./coverage.json
