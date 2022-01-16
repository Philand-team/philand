import { expect } from "chai";
import { ethers } from "hardhat";
// import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";

// npx hardhat test --network rinkeby
// philand.ethの権限がないとエラーが出る。
describe("SubdomainENS", function () {
  it("check success ", async function () {
    // const ENS = await ethers.getContractFactory("ENS");
    // await ENS.deploy();
    const [owner] = await ethers.getSigners();
    const ownerAddress = owner.address;
    const ensAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
    const signer = await ethers.getSigner(ownerAddress);
    const SubdomainENS = await ethers.getContractFactory(
      "SubdomainENS",
      signer
    );
    const subdomainENS = await SubdomainENS.connect(signer).deploy(ensAddress);
    console.log("Subdomain deployed to:", subdomainENS.address);
    const doregistTX = await subdomainENS.doregist("test");
    await doregistTX.wait();
    expect(await subdomainENS.getOwnerDomain(ownerAddress)).to.equal("test");
  });
});
