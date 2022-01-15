// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const ownerAddress = "0x58Eb67DcA41dAC355cE0E9858bA3e8E9e867FC93";
  const signer = await ethers.getSigner(ownerAddress);

  console.log("Deployment from: ", signer.address);
  const ensAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";

  const SubdomainENS = await ethers.getContractFactory("SubdomainENS", signer);
  const subdomainENS = await SubdomainENS.connect(signer).deploy(ensAddress);

  console.log("Subdomain deployed to:", subdomainENS.address);

  const Render = await ethers.getContractFactory("dungeonsRender", signer);
  const render = await Render.connect(signer).deploy();
  console.log("DungeonsRender deployed to:", render.address);

  const Generator = await ethers.getContractFactory(
    "dungeonsGenerator",
    signer
  );
  const generator = await Generator.connect(signer).deploy();
  console.log(`Generator deployed to: ${generator.address}`);

  const Seeder = await ethers.getContractFactory("dungeonsSeeder", signer);
  const seeder = await Seeder.connect(signer).deploy();
  console.log(`Seeder deployed to: ${seeder.address}`);

  const Dungeons = await ethers.getContractFactory("Dungeons", signer);
  const dungeons = await Dungeons.connect(signer).deploy(
    subdomainENS.address,
    render.address,
    generator.address,
    seeder.address
  );
  console.log(`Dungeons Contract Address: ${dungeons.address}`);

  const countryContractFactory = await ethers.getContractFactory("CountryLand");

  const countryContract = await countryContractFactory.deploy(
    ["Japan", "US", "AUS"],
    [
      "https://bafkreiek3wfrrshjthcfavts6hgwoojowvakmp7t5mexhnoefm5hv4vydy.ipfs.dweb.link/",
      "https://bafkreicxciez4oysbhlzupp7uxrzuniiyqkzybbijounyomw65ogxfq4y4.ipfs.dweb.link/",
      "https://bafkreif4z2yt7odyw2czdv75jfkpskcmszwviyoytihrdumwfrvses7fsa.ipfs.dweb.link/",
    ],
    [100, 200, 300],
    [100, 50, 25]
  );

  console.log("Country Contract deployed to:", countryContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
