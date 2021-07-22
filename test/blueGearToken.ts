import { ethers } from "hardhat";
import { Contract, Signer, BigNumber } from "ethers";
import { expect, assert } from "chai";

let accounts: Signer[];
let account1: Signer;
let account2: Signer;
let account3: Signer;
let contract: Contract;
let contractAddr = "0x47cC0eb92a9b53CDCfd318aE90d913D2779eEdba";
let addr1: any;
let addr2: any;
let addr3: any;
let tx: any;
let transferNum = BigNumber.from(`10`);
let approveNum = BigNumber.from(`55`);

async function getAccountInfo(){
  let balance1 = (await contract.balanceOf(addr1)).toString();
  let balance2 = (await contract.balanceOf(addr2)).toString();
  let allowance1 = (await contract.allowance(addr1, addr2)).toString();
  let allowance2 = (await contract.allowance(addr2, addr1)).toString();
  console.log("Balance of account1:", balance1);
  console.log("Balance of account2:", balance2);
  console.log("Allowance of account1:", allowance1);
  console.log("Allowance of account2:", allowance2);
}

describe("Deplay the BlueGearToken Contract", function(){
  before(async () => {
    [account1, account2, account3] = await ethers.getSigners();
    addr1 = await account1.getAddress();
    addr2 = await account2.getAddress();
    addr3 = await account3.getAddress();
    console.log("Account1:", addr1);
    console.log("Account2:", addr2);
    console.log("Account3:", addr3);
  })

  it("Get contract...", async function() {
    let factory = await ethers.getContractFactory("BlueGearToken");
    contract = await factory.deploy();
    await contract.deployed();
    //contract = await factory.attach(contractAddr);
    console.log("Addr of BlueGearToken:", contract.address);
    console.log("Owner:", await contract.owner());
  })

  it("Test transfer and balanceOf function...", async function() {
    contract = await contract.connect(account1);
    let balance = await contract.balanceOf(addr2);
    tx = await contract.transfer(addr2, transferNum);
    await tx.wait();
    let newBalance = (await contract.balanceOf(addr2)).toString();
    
    let v1 = balance.add(transferNum);
    let v2 = BigNumber.from(newBalance);

    expect(v1).to.equal(v2);
  })

  it("Test approve, allowance, and transferFrom function...", async function() {
    contract = await contract.connect(account1);
    tx = await contract.approve(addr2, approveNum);
    await tx.wait();
    let allowance = await contract.allowance(addr1, addr2);
    expect(allowance).to.equal(approveNum);
    let balance = await contract.balanceOf(addr3);
    contract = await contract.connect(account2);
    tx = await contract.transferFrom(addr1, addr3, allowance);
    await tx.wait();
    let newBalance = await contract.balanceOf(addr3);
    expect(newBalance).to.equal(balance.add(allowance));
    allowance = await contract.allowance(addr1, addr2);
    expect(allowance).to.equal(BigNumber.from(`0`));
  })

})
