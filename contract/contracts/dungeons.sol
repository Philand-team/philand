// SPDX-License-Identifier: CC0-1.0

/// @title The Crypts and Caverns ERC-721 token

/*****************************************************
0000000                                        0000000
0001100  Crypts and Caverns                    0001100
0001100     9000 generative on-chain dungeons  0001100
0003300                                        0003300
*****************************************************/

/* Crypts and Caverns is an onchain map generator that produces an infinite set of dungeons.

Like Loot, these maps contain a minimal amount of information and structure so that game designers and developers can interpret the map as they see fit.

A dungeon map contains walls, floors, doors, and points of interest which make up the map. Each dungeon also has an environment and a name to set a mood for the dungeon. These are specific enough to allow each map to have its own identity but vague enough to allow substantial interpretation.

The tokenURI also outputs a simple pixel art representation of the dungeon to help visualize the map.

Crypts and Caverns are free to use however you want. 

Learn more at: https://threepwave.com/cryptsandcaverns


The dungeons API aims to be simple and is aimed at smart contract developers wanting to create onchain games:

getLayout(uint256 tokenId) - Returns a bytes array representing walls (0) and floor tiles (1). Length is always 64 bytes.
getSize(uint256 tokenId) - Returns a uint256 representing the width or height of a dungeon. All dungeons are square so size 7 is '7x7.'
getEntities(uint256 tokenId) - Returns an array of entities representing points (entityType 0) and doors (entitType 1). There are at most 32 entities.
getEnvironment(uint256 tokenId) - Returns a uint256 between 0->5 representing an environment or mood for the map.
getName(uint256 tokenId) - Returns a string with names for the dungeon. Names may be repeated across dungeons.
getNumPoints(uint256 tokenId) - Returs the number of points present in a given dungeon.
getNumDoors(uint256 tokenId) - Returns the number of doors present in a given dungeon.
getSvg(uint256 tokenId) - Returns a base64 encrypted svg with a visual representation of a given dungeon.
*/

pragma solidity ^0.8.0;

/* ERC-721 Boilerplate */
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/* Dependencies */
import { IDungeons } from './interfaces/IDungeons.sol';
import { IDungeonsGenerator } from './interfaces/IDungeonsGenerator.sol';
import { IDungeonsRender } from './interfaces/IDungeonsRender.sol';
import { IDungeonsSeeder } from './interfaces/IDungeonsSeeder.sol';

 interface Subdomain {
    function ownerOf(uint256 tokenId) external view returns (address owner);
}

/* Dungeons contract code starts here */
contract Dungeons is IDungeons, ERC721Enumerable, ReentrancyGuard, Ownable {
    IDungeonsRender public render;  // Render to SVG
    IDungeonsGenerator public generator;  // Dungeon Generation
    IDungeonsSeeder public seeder;

    // Store seeds for our maps
    mapping(uint256 => uint256) public seeds;

    Subdomain internal subdomainContract;

    // Mint Supply
    uint256 public lastMint = 8000;
    uint256 public claimed = 0;
    bool public restricted = true;  // Restrict claim to subdomain owners by default

    // Pricing Information
    uint256 public price = 0.05 ether;     // 0.05ETH

    event Minted(address indexed account, uint256 tokenId);
    event Claimed(address indexed account, uint256 tokenId);

 
    
    /**
    * @dev  Allows a user to mint a token. There is a supply of 1000 tokens available to mint.
    *       Minted tokens start at 8000 and ends at 9000.
    */
    
    function mint(uint256 tokenId) override public nonReentrant {
        require(lastMint < 9000, "Token sold out");
        require(!restricted || subdomainContract.ownerOf(tokenId) == msg.sender, "Not your Subdomain");
        // require(msg.value >= price, "Insufficient ETH");
        uint256 tokenId = ++lastMint;    // Grab the top token in the list

        seeds[tokenId] = seeder.getSeed(tokenId);
        _safeMint(_msgSender(), tokenId);
        emit Minted(_msgSender(), tokenId);
    }

    /**
    * @dev Allows anyone to claim #1-7777 (e.g. after initial subdomain owner claim period)
    */
    function openClaim() override public nonReentrant onlyOwner {
        restricted = !restricted;
    }

    /**
    * @dev  Allows the owner to withdraw eth to another wallet.
    */
    function withdraw(address payable recipient, uint256 amount) override public nonReentrant onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        (bool succeed,) = recipient.call{value: amount}("");
        require(succeed, "Withdraw failed");
    }

    /* Read Functions */
    function tokenURI(uint256 tokenId) override (ERC721, IDungeons) public view returns (string memory) {
        // Generate full dungeon metadata (for opensea, etc) 
        isValid(tokenId);
        Dungeon memory dungeon = generateDungeon(tokenId);

        uint256[] memory entities = new uint256[](2);
        (entities[0], entities[1]) = generator.countEntities(dungeon.entities.entityType);
        
        return(render.tokenURI(tokenId, dungeon, entities));
    }

    /**
    * @dev Returns the width/height of the map (all maps are square). For example a size of '8' implies a 8x8 grid.
    * Size can be as small as 6x6 and as large as 30x30.
    * Example:  uint256 private size = 8;
    */
    function getSize(uint256 tokenId) public view override returns (uint8) {
        isValid(tokenId);

        return seeder.getSize(seeds[tokenId]);
    }

    /**
    * @dev Returns a representation of the floors and walls in a dungeon. 
    * Layout is returned as a 64-bit bytes array where each bit (From right to left) represents a wall (0) or a floor (1)
    * Example:  bytes layout = 0x0000000000000000018003000607ec0ff81fa03fc061f003e007c00000000000;
    */
    function getLayout(uint256 tokenId) public view override returns (bytes memory) {
        isValid(tokenId);
        (bytes memory layout, ) = generator.getLayout(seeds[tokenId], getSize(tokenId));
        return layout;
    }

    /**
    * @dev Returns a list of entities (e.g. doors, points of interest) in the dungeon
    * Entities have an x position, a y position, and a 'EntityType' which describes the entity.
    * Each value is returned as a series of 3 integers: [x, y, entityType]. 
    * If there are multiple entities, you'll have multiple sets of 3 [x1, y1, entityType1, x2, y2, entityType2]
    * In this case, all entities are either type 0 (Door) or 1 (Point of Interest).
    * It's up to the game designer to interpret what those represent.
    * Example:  Entity[] entities = [0, 5, 1, 6, 3, 0]
    */
    function getEntities(uint256 tokenId) public view override returns (uint8[] memory, uint8[] memory, uint8[] memory) {
        isValid(tokenId);
        // uint256 seed = seeder.getSeed(tokenId); // TODO - Test tokenId

        (uint8[] memory x, uint8[] memory y, uint8[] memory entityType) = generator.getEntities(seeds[tokenId], getSize(tokenId));
        return (x, y, entityType);
    }

    /**
    * @dev Returns the number (uint256) of points of interest present in a given map.
    * Example: uint256 numDoors = 2;
    */
    function getNumPoints(uint256 tokenId) public view override returns (uint256) {
        isValid(tokenId);

        ( , uint256 numPoints) = generator.getPoints(seeds[tokenId], getSize(tokenId));

        return numPoints;
    }

    /**
    * @dev Returns the number (uint256) of doors present in a given map.
    * Example: uint256 numDoors = 2;
    */
    function getNumDoors(uint256 tokenId) public view override returns (uint256) {
        isValid(tokenId);

        (, uint256 numDoors) = generator.getDoors(seeds[tokenId], getSize(tokenId));

        return numDoors;
    }

    /**
    * @dev Returns the environment which a given map takes place in. There are currently 6 environments defined with id's 0->5. Other maps may choose to define new environments or interpret these differently
    * Example: uint16 private environment = 0;
    */
    function getEnvironment(uint256 tokenId) public view override returns (uint8) {
        isValid(tokenId);

        return seeder.getEnvironment(seeds[tokenId]);
    }

    /**
    * @dev Returns the name of this dungeon. Names reference a place and typically look something like "Prisoner's Den."
    * Names can be as short as ___ characters and as long as ___ characters. Names do not contain special characters but may contain an apostrophe (').
    * export const genName = function(R) {
    * Base Land (30%)
    * Prefix + Base Land (30%)
    * Base Land + Suffix (22%)
    * Prefix + Base Land + Suffix (15%)
    * Name + Base Land (3%)
    * Unique Name (0.15%)
    * Example: string private dungeonName = "Den of the Keeper";
    */
    function getName(uint256 tokenId) public view override returns (string memory) {
        isValid(tokenId);
        (string memory dungeonName, , ) = seeder.getName(seeds[tokenId]);
        return dungeonName;
    }


   /**
    * @dev Returns a string containing a valid SVG representing the dungeon
    * The SVG is pixel-art resolution so the game developer can interpret it as they see fit
    * Colors are based on 'getEnvironment()'
    * Example: string svg = "<svg><rect x='100' y='20' height='10' widdth='10' /></svg>"
    */
    function getSvg(uint256 tokenId) public view override returns (string memory) {
        // Generate dungeon layout
        Dungeon memory dungeon = generateDungeon(tokenId);

        return render.draw(dungeon, dungeon.entities.x, dungeon.entities.y, dungeon.entities.entityType);
    }   

    function generateDungeon(uint256 tokenId) private view returns (Dungeon memory) {
    // Generates dungeon metadata from a given tokenId
        (uint8[] memory x, uint8[] memory y, uint8[] memory entityType) = getEntities(tokenId);
        (bytes memory layout, uint8 structure) = generator.getLayout(seeds[tokenId], getSize(tokenId));
        (string memory dungeonName, string memory affinity, uint8 legendary) = seeder.getName(seeds[tokenId]);
        return Dungeon(getSize(tokenId), getEnvironment(tokenId), structure, legendary, layout, EntityData(x, y, entityType), affinity, dungeonName);
    }

    /* Utility Functions */
    function isValid(uint256 tokenId) internal view {
    // Validate that the token is within range when querying
        require(tokenId > 0 && tokenId < 9001, "Token ID invalid");
        require(_exists(tokenId), "Token is not minted yet");
    }

    constructor(Subdomain _subdomainContract, IDungeonsRender _render, IDungeonsGenerator _generator, IDungeonsSeeder _seeder) ERC721("ENS make PhiLands", "PHILAND") Ownable() {
        subdomainContract = _subdomainContract;
        render = _render;
        generator = _generator;
        seeder = _seeder;
    }


}
