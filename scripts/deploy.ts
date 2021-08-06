import { run, ethers } from "hardhat";

async function main() {
  await run("compile");

  const accounts = await ethers.getSigners();
  for(let i=0; i<5; i++)
  {
    console.log("account[%d] = %s", i, await accounts[i].getAddress());
  }
  let factory = await ethers.getContractFactory('ERC20Token');
  let totalSupply = 1000;
  let contract = await factory.deploy(totalSupply);
  await contract.deployed();
  console.log("addr of signer:", await contract.signer.getAddress());
  console.log("addr of ERC20Token:", contract.address);
  console.log("name:", await contract.name());
  console.log("symbol:", await contract.symbol());
  console.log("decimals:", await contract.decimals());
  console.log("total supply:", (await contract.totalSupply()).toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
