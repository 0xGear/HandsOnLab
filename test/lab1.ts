import { ethers } from "hardhat";
import { Contract, Signer, BigNumber} from "ethers";
import { expect, assert } from "chai";

let accounts: Signer[];
let account1: Signer;
let iContract: Contract;
let contract: Contract;
let addr1: any;
let labAddr: any;
let tx: any;


describe("Test Lab1", function(){
  before(async () => {
    accounts = await ethers.getSigners();
    account1 = accounts[0];
    addr1 = await account1.getAddress();
    console.log("Account1:", addr1);
  })

  it("Deplay ILab1 contract", async function() {
    let factory = await ethers.getContractFactory("ILab1");
    iContract = await factory.deploy();
    await iContract.deployed();
    console.log("Addr of interface contract:", iContract.address);
  })

  it("Test createLab function", async function() {
    tx = await iContract.createLab(addr1);
    await tx.wait();
    console.log("Addr of lab:", tx);
  })
  
  it("Test doLab function", async function() {
    let factory = await ethers.getContractFactory("Lab1");
    labAddr = await iContract.getLabAddress(addr1);
    console.log("Addr of lab:", labAddr);
    contract = await factory.attach(labAddr);
    tx = await contract.isCompleted();
    console.log("Completed:", tx);
    tx = await contract.doLab();
    tx.wait();
    tx = await contract.isCompleted();
    console.log("Completed:", tx);
  })
})
