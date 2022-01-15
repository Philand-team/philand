// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.4;

import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { Base64 } from "./libraries/Base64.sol";
import { SVGcard } from "./libraries/SVGcard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SubdomainENS is ERC721URIStorage,  Ownable{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    //ENS address: 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e
    ENS internal ens; 

    // namehash('eth')
    bytes32 TLD_NODE = 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae;
    
    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;
     // Mapping owner address to token count
    mapping(address => string) private _balances;
    bytes32 domainNode;
    bytes32 countryNode; 
    bytes32 stateNode;
    bytes32 subnode;

     // We split the SVG at the part where it asks for the background color.
    // string svgPartOne = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
    string private svgPartTwo = "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";
    // string[] contriesWords = ["UME", "SAKURA", "FUJI","AYAME", "BOTAM", "MATSU"];
    // string[] statesWords = ["APOLO", "MERCURY", "VENUS","DIANA", "MARS","JUPITER", "NEPTUNE", "PLUTO"];
    string[] private contriesWords = ["uuu"];
    string[] private statesWords = ["aaa"];
    // Get fancy with it! Declare a bunch of colors.
    string[] private colors = ["c20822", "08C2A8", "000000", "a808c2", "08c2a8", "08c2a8"];

    event NewEpicNFTMinted(address sender, uint256 tokenId);


    constructor(ENS _ens) ERC721 ("philand subdomain NFT", "ENSCARD") {
        ens = _ens;
    }

    function pickRandomCountry(uint256 tokenId) internal view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("Contry", Strings.toString(tokenId))));
        rand = rand % contriesWords.length;
        return contriesWords[rand];
    }
    function pickRandomState(uint256 tokenId) internal view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("State", Strings.toString(tokenId))));
        rand = rand % statesWords.length;
        return statesWords[rand];
    }
    // Same old stuff, pick a random color.
    function pickRandomColor(uint256 tokenId) internal view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("COLOR", Strings.toString(tokenId))));
        rand = rand % colors.length;
        return colors[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(input)));
    }

    function getOwnerDomain(address owner) public view virtual returns (string memory) {
        return _balances[owner];
    }
    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }
    
    function doregist(string calldata subdomain) external payable  {
        uint256 newItemId = _tokenIds.current();
        string memory country = pickRandomCountry(newItemId);
        string memory state = pickRandomState(newItemId);
        string memory origin ="philand";
        string memory combinedWord = string(abi.encodePacked(subdomain,".",state,".", country,".", origin,".eth"));
        string memory svgPartOne=SVGcard.generateSVG(pickRandomColor(newItemId),combinedWord);
        
        
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
        countryNode = keccak256(abi.encodePacked(domainNode, keccak256(bytes(country))));
        stateNode = keccak256(abi.encodePacked(countryNode, keccak256(bytes(state))));
        subnode = keccak256(abi.encodePacked(stateNode,keccak256(bytes(subdomain))));
        
        require(ens.owner(subnode)==address(0),'already minted');
        // address constant rinkebyResolver = 0xf6305c19e814d2a75429Fd637d01F7ee0E77d615;
        ens.setSubnodeRecord(stateNode, keccak256(bytes(subdomain)), msg.sender,0xf6305c19e814d2a75429Fd637d01F7ee0E77d615,0);
        ens.setSubnodeOwner(stateNode,keccak256(bytes(subdomain)),msg.sender);
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, string(abi.encodePacked("data:application/json;base64,", json)));
        _balances[msg.sender] = combinedWord;
        _owners[newItemId] = msg.sender;
        _tokenIds.increment();
        emit NewEpicNFTMinted(msg.sender, newItemId);
    }
}