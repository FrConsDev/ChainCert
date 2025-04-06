// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

contract ChainCert is ERC721A, Ownable {
    using Strings for uint256;

    struct Product {
        string serialNumber;
        string publicId;
        string metadataURI;
        address enterprise;
        bool isClaimed;
        bool isForSale;
        uint256 price;
        uint256 tokenId;
    }

    mapping(string => uint256) private _publicIdToTokenId;
    mapping(string => uint256) private _serialNumberToTokenId;
    mapping(uint256 => Product) private _products;

    event ProductMinted(
        address indexed recipient,
        uint256 tokenId,
        string metadata,
        string serialNumber,
        string publicId
    );

    event ProductClaimed(
        address indexed buyer,
        uint256 indexed tokenId,
        string serialNumber,
        string publicId,
        string metadataURI,
        bool isClaimed
    );

    constructor() ERC721A("ChainCert", "CC") Ownable(msg.sender) {}

    function _startTokenId() internal pure override returns (uint256) {
        return 1;
    }

    /**
     * @dev Mint a NFT a product on behalf of a enterprise
     * @param recipient Adress who will receive the NFT
     * @param metadata Product metadata
     * @param serialNumber Unique product serial number
     * @param publicId Unique product publicId
     */
    function mintProduct(
        address recipient,
        string memory metadata,
        string memory serialNumber,
        string memory publicId
    ) external onlyOwner returns (uint256) {
        require(
            _serialNumberToTokenId[serialNumber] == 0,
            "Product already registered"
        );
        require(_publicIdToTokenId[publicId] == 0, "PublicId already used");

        uint256 newTokenId = _nextTokenId();
        _mint(address(this), 1);

        _serialNumberToTokenId[serialNumber] = newTokenId;
        _publicIdToTokenId[publicId] = newTokenId;

        _products[newTokenId] = Product({
            serialNumber: serialNumber,
            publicId: publicId,
            metadataURI: metadata,
            enterprise: recipient,
            isClaimed: false,
            isForSale: false,
            price: 0,
            tokenId: newTokenId
        });

        emit ProductMinted(
            recipient,
            newTokenId,
            metadata,
            serialNumber,
            publicId
        );

        return newTokenId;
    }

    /**
     * @dev A buyer claim product ownership by sending serial number
     * @param serialNumber Unique product serial number
     */
    function claimProduct(string memory serialNumber) external {
        uint256 tokenId = _serialNumberToTokenId[serialNumber];
        require(tokenId != 0, "Product not found");
        Product storage product = _products[tokenId];
        require(!product.isClaimed, "Product already claimed");

        _approve(msg.sender, tokenId, false);
        safeTransferFrom(address(this), msg.sender, tokenId);

        product.isClaimed = true;

        emit ProductClaimed(
            msg.sender,
            tokenId,
            serialNumber,
            product.publicId,
            product.metadataURI,
            true
        );
    }

    /**
     * @dev Return product details from a publicId
     * @param publicId Unique product publicId
     */
    function getProductDetailsByPublicId(
        string memory publicId
    ) external view returns (Product memory) {
        uint256 tokenId = _publicIdToTokenId[publicId];
        require(tokenId != 0, "Product not found");
        return _products[tokenId];
    }

    /**
     * @dev Return all product owned by a buyer. An owned product limit can be set in order to enforce security and performance
     */
    function getProductsByOwner() external view returns (Product[] memory) {
        uint256 balance = balanceOf(msg.sender);
        require(balance > 0, "You dont own any product");

        Product[] memory ownerProducts = new Product[](balance);
        uint256 count = 0;

    // ****************************************************************** revoir la boucle faire un maping
        for (uint256 i = _startTokenId(); i < _nextTokenId(); i++) {
            if (_exists(i) && ownerOf(i) == msg.sender) {
                ownerProducts[count] = _products[i];
                count++;
            }
        }

        return ownerProducts;
    }
}
