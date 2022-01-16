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
  const SubdomainAddress = "0x0846D40330a36AB0114004cCEE5A286556E270c3";
  const DungeonsRenderAddress = "0xa99A9127dCCbeeA9830bd5EDF4ea2c9bc2878b7f";
  const GeneratorAddress = "0x3133B51B29228C0de8649683fa0E75Fd3195148d";
  const SeederAddress = "0x76C9a36E3cB1B675c093CcE2d40d734B54fEA4C1";

  const Dungeons = await ethers.getContractFactory("Dungeons", signer);
  const dungeons = await Dungeons.connect(signer).deploy(
    SubdomainAddress,
    DungeonsRenderAddress,
    GeneratorAddress,
    SeederAddress
  );
  console.log(`Dungeons Contract Address: ${dungeons.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
