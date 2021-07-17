// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Punchcard is ERC721, ERC721Enumerable, Pausable, Ownable {
    using SafeMath for uint256;

    uint256 _numberMintedFree = 0;
    uint256 _mintPrice;
    string _baseURIValue;
    uint256 _saleStart;
    uint256 _freeMintStartOffset;
    uint256 _freeMintEndOffset;
    mapping(address => bool) private _freeMints;
    mapping(uint256 => string) private _content;
    mapping(uint256 => bool) private _contentSet;

    event SetContent(address indexed owner, uint256 indexed tokenId, string indexed content );

    constructor(uint256 saleStart_, string memory baseURIVal_)
        ERC721("Punchcard", "PUNCH")
    {
        _baseURIValue = baseURIVal_;
        _saleStart = saleStart_;
        _mintPrice = 0.01 ether;
        _freeMintStartOffset = 0;
        _freeMintEndOffset = 60 * 60 * 24;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseURIValue;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function saleStart() public view returns (uint256) {
        return _saleStart;
    }

    function freeMintStart() public view returns (uint256) {
        return _saleStart.sub(_freeMintStartOffset);
    }

    function freeMintEnd() public view returns (uint256) {
        return _saleStart.add(_freeMintEndOffset);
    }

    function setSaleStart(uint256 saleStart_) public onlyOwner {
        _saleStart = saleStart_;
    }

    function saleHasStarted() public view returns (bool) {
        return _saleStart <= block.timestamp;
    }

    modifier ensureSaleHasStarted() {
        require(saleHasStarted(), "Sale has not started yet");
        _;
    }

    modifier freeMintHasStarted() {
        require(_afterFreeMintStart(), "Free mint period has not started yet");
        _;
    }

    modifier freeMintHasNotEnded() {
        require(_beforeFreeMintEnd(), "Free mint period has ended");
        _;
    }

    function _afterFreeMintStart() private view returns (bool) {
        return freeMintStart() <= block.timestamp;
    }

    function _beforeFreeMintEnd() private view returns (bool) {
        return freeMintEnd() > block.timestamp;
    }

    function freeMintPeriodActive() public view returns (bool) {
        return (_afterFreeMintStart() && _beforeFreeMintEnd());
    }

    function baseURI() public view returns (string memory) {
        return _baseURI();
    }

    function setBaseURI(string memory newBase) public onlyOwner {
        _baseURIValue = newBase;
    }

    function mintPrice() public view returns (uint256) {
        return _mintPrice;
    }

    function setMintPrice(uint256 price) public onlyOwner {
        _mintPrice = price;
    }

    function callerHasClaimedFreeToken() public view returns (bool) {
        return _freeMints[msg.sender];
    }

    function numberMintedFree() public view returns (uint256) {
        return _numberMintedFree;
    }

    modifier validatePurchasePrice(uint256 numberOfTokens) {
        require(
            _mintPrice.mul(numberOfTokens) == msg.value,
            "Ether value sent is not correct"
        );
        _;
    }

    function _mintTokens(uint256 numberOfTokens) internal {
        for (uint256 i = 0; i < numberOfTokens; i++) {
            _safeMint(msg.sender, totalSupply());
        }
    }

    function setContent(uint256 tokenId, string memory content) public {
        address owner = ERC721.ownerOf(tokenId);
        require(_msgSender() == owner,"Caller is not owner");
        require(!_contentSet[tokenId], "Content is already burned");

        _content[tokenId] = content;
        _contentSet[tokenId] = true;

        emit SetContent(owner, tokenId, content);
    }

    function getContent(uint256 tokenId) public view virtual returns (string memory) {
        return _content[tokenId];
    }

    function contentIsSet(uint256 tokenId) public view returns (bool) {
        return _contentSet[tokenId];
    }

    function mintTokens(uint256 numberOfTokens)
        public
        payable
        whenNotPaused
        ensureSaleHasStarted
        validatePurchasePrice(numberOfTokens)
    {
        _mintTokens(numberOfTokens);
    }

    function claimFreeToken()
        public
        whenNotPaused
        freeMintHasStarted
        freeMintHasNotEnded
    {
        require(!_freeMints[msg.sender], "Free token has already been claimed");
        _freeMints[msg.sender] = true;
        _numberMintedFree = _numberMintedFree.add(1);

        _mintTokens(1);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}