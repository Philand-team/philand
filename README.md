# Philand
## What is this
Phi Land（φ Land）- Generates a unique Metaverse Land to Anyone with an ENS address.
https://showcase.ethglobal.com/nfthack2022/phi-land

## Summary
- Interpret ENS as a Metaverse address
- Utilizing the ENS subdomain, you can generate metaverse land NFTs at ●●●.philand.eth
- Community Owned & Driven


## Rinkeby Contract Address info
Deployment from:  0x58Eb67DcA41dAC355cE0E9858bA3e8E9e867FC93

- Subdomain deployed to: 0x54A65BE1Dd96abf0A4b93e57e2D5CF0d8b414e88
- DungeonsRender deployed to: 0xceeA2f0292b3dfC1d64ACcAC3d5c3f35bDC3Ef1C
- Generator deployed to: 0x83dBBff689F17262D3e02087F393231302C97788
- Seeder deployed to: 0x6D2093B9ac6dc186Ba25318dc29FB11714886612
- Dungeons Contract Address: 0xfCAFF208686849d3455C9f292f53f807C4D71Fab

## EtherScan
- Subdomain
https://rinkeby.etherscan.io/address/0x54A65BE1Dd96abf0A4b93e57e2D5CF0d8b414e88
- Dungeons
https://rinkeby.etherscan.io/address/0xfCAFF208686849d3455C9f292f53f807C4D71Fab

# Notable Files:
- `/contract/contracts/SubdomainENS.sol` - Manage domain COntaractCreate Subdomain and make subdomain NFT.
- `/contract/contracts/libraries/SVGcard.sol` - SVG card making inspired by https://github.com/Uniswap/v3-periphery/blob/v1.0.0/contracts/libraries/NFTSVG.sol.
- `/contract/contracts/dungeoons.sol` - Philand making. forked by https://github.com/threepwave/cryptsandcaverns/blob/main/contract/README.md
- `/frontend/App.js` - WebUi for making Subdomain NFT and Philand NFT.
## Architecture(Figma)
 https://www.figma.com/file/o8NobrsafesdOFqxaRa0um/architecture?node-id=0%3A1

## opensea
- ENScard https://testnets.opensea.io/collection/philand-subdomain-nft-v4
- Philand https://testnets.opensea.io/collection/ens-make-philands-v3
## Installation
1. Clone this repository
2. Install dependencies: `yarn`
3. `yarn start`
## Contract deploy
1. create a node in Moralis.
2. cd contract && make .env
3. npx hardhat run scripts/deploy.ts --network rinkeby

## How to verify on etherscan
1. install `@nomiclabs/hardhat-etherscan`
2. put your etherscan api key into hardhat.config.js
2. Run command: `npx hardhat verify --network <blah> <contract> <arguments (optional)>`
<!-- Deployment from:  0x58Eb67DcA41dAC355cE0E9858bA3e8E9e867FC93
#ropsten
Subdomain deployed to: 0x8030B66f024876f34bE1ED3A63fe45F2d110f94E
DungeonsRender deployed to: 0x54b4e97d32b6C33E6d0A648CECEe1C78c3cC3AF5
Generator deployed to: 0x6282A35d5CCDe569F2F138628844d1CCaD1d82ef
Seeder deployed to: 0xFBDe8b322B602D286A8fb09A7adD4ec3764085EC
Dungeons Contract Address: 0xa88A8C629c99cA1a43B0D85F861C26110B672BAB -->