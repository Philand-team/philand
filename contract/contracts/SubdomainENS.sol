// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.4;

import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { Base64 } from "./libraries/Base64.sol";
import { SVGcard } from "./libraries/SVGcard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SubdomainENS is ERC721URIStorage, ReentrancyGuard,Ownable{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    //ENS address: 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e
    ENS internal ens; 

    // namehash('eth')
    bytes32 TLD_NODE = 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae;
    address rinkebyResolver = 0xf6305c19e814d2a75429Fd637d01F7ee0E77d615;
    address ropstenResolver = 0x42D63ae25990889E35F215bC95884039Ba354115;
    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;
     // Mapping owner address to subdomain
    mapping(address => string) private _subdomains;
    bytes32 domainNode;
    bytes32 subnode;

    //  Declare a bunch of colors.
    string[] private colors = ["c20822", "08C2A8", "000000", "a808c2", "08c2a8", "08c2a8"];

    event NewEpicNFTMinted(address sender, uint256 tokenId);

    constructor(ENS _ens) ERC721 ("philand subdomain NFT", "ENSCARD") {
        ens = _ens;
    }
    
    function random(string memory input) internal pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(input)));
    }
    function pickRandomColor(uint256 tokenId) internal view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("COLOR", Strings.toString(tokenId))));
        rand = rand % colors.length;
        return colors[rand];
    }
    
    function withdraw(address payable recipient, uint256 amount)public nonReentrant onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        (bool succeed,) = recipient.call{value: amount}("");
        require(succeed, "Withdraw failed");
    }
    
    function getOwnerDomain(address owner) public view virtual returns (string memory) {
        return _subdomains[owner];
    }
    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }
    
    function doregist(string calldata subdomain) external payable nonReentrant{
        uint256 newItemId = _tokenIds.current();
        string memory origin ="philand";

        // We split the SVG at the part
        string memory combinedWord = string(abi.encodePacked(subdomain,".", origin,".eth"));
        string memory svgPartOne=SVGcard.generateSVG(pickRandomColor(newItemId),combinedWord);
        string memory svgPartTwo = "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";
        
        string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "',
                    combinedWord,
                    '", "description": "A collection of philand.", "image": "data:image/svg+xml;base64,',
                    Base64.encode(bytes(string(abi.encodePacked(svgPartOne, svgPartTwo, combinedWord, "</text></svg>")))),
                    '"}'
                )
            )
        )
    );          
        
        domainNode = keccak256(abi.encodePacked(TLD_NODE, keccak256(bytes(origin))));
        subnode = keccak256(abi.encodePacked(domainNode,keccak256(bytes(subdomain))));
        require(ens.owner(subnode)==address(0),'already minted');

        ens.setSubnodeRecord(domainNode, keccak256(bytes(subdomain)), msg.sender,ropstenResolver,0);
        ens.setSubnodeOwner(domainNode,keccak256(bytes(subdomain)),msg.sender);
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, string(abi.encodePacked("data:application/json;base64,", json)));
        _subdomains[msg.sender] = combinedWord;
        _owners[newItemId] = msg.sender;
        _tokenIds.increment();
        emit NewEpicNFTMinted(msg.sender, newItemId);
    }
}