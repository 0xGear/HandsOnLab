import { ethers } from "hardhat";
import { ContractFactory, Contract, Signer, BigNumber} from "ethers";
import { expect, assert } from "chai";

let accounts: Signer[];
let account1: Signer;
let handsOnLab: Contract;
let blueGearToken: Contract;
let iLab: Contract;
let lab: Contract;
let factory: ContractFactory;
let addr1: any;
let labAddr: any;
let tx: any;
let value: any;
let names = ["Alice", "Bob", "Charles"];


describe("Test Hands-on-Lab", function(){
  before(async () => {
    accounts = await ethers.getSigners();
    account1 = accounts[0];
    addr1 = await account1.getAddress();
    console.log("Account1:", addr1);
    
    factory = await ethers.getContractFactory("HandsOnLab");
    handsOnLab = await factory.deploy();
    console.log("Addr of HandsOnLab:", handsOnLab.address);
    tx = await handsOnLab.deployTransaction.wait();
    console.log("Tx receipt:", tx.blockNumber, tx.transactionHash);

    factory = await ethers.getContractFactory("BlueGearToken");
    blueGearToken = await factory.deploy();
    console.log("Addr of BlueGearToken:", blueGearToken.address);
    tx = await blueGearToken.deployTransaction.wait();
    console.log("Tx receipt:", tx.blockNumber, tx.transactionHash);
    
    //deploy iLab1 contract
    factory = await ethers.getContractFactory("ILab1");
    iLab = await factory.deploy();
    console.log("Addr of ILab:", iLab.address);
    tx = await iLab.deployTransaction.wait();
    console.log("Tx receipt:", tx.blockNumber, tx.transactionHash);
  })


  it("Test setToken and getToken function", async function() {
    let tokenAddr = blueGearToken.address;
    tx = await handsOnLab.setToken(tokenAddr);
    tx = await tx.wait();
    console.log("Tx of setToken:", tx.blockNumber, tx.transactionHash);
    tx = await handsOnLab.getToken();
    console.log("Rst of getToken:", tx);
    expect(tokenAddr).to.equal(tx);
  })

  it("Test setLab and getLab function", async function() {
    tx = await handsOnLab.setLab(1, iLab.address);
    tx = await tx.wait();
    console.log("Tx of setLab:", tx.blockNumber, tx.transactionHash);
    tx = await handsOnLab.getLab(1);
    console.log("Rst of getLab:", tx);
    expect(tx).to.equal(iLab.address);
  })

  it("Test register and getStudent fucntion", async function() {
    console.log("Signer of HandsOnLab:", await handsOnLab.signer.getAddress());
    for(let i=0; i<names.length; i++)
    {
      let handsOnLabTmp = await handsOnLab.connect(accounts[i+1]);
      tx = await handsOnLabTmp.register(names[i]);
      tx = await tx.wait();
      let num = (await handsOnLab.getStudentNum()).toString();
      let addr = await accounts[i+1].getAddress();
      tx = await handsOnLab.getStudentLab(addr, 1);
      console.log("Student Info:",num, tx.stuName, tx.stuAddr, tx.labAddr);
      expect(tx.stuName).to.equal(names[i]);
    }
  })
  
  it("Test doLab function", async function() {
    for(let i=0; i<names.length; i++)
    {
      let handsOnLabTmp = await handsOnLab.connect(accounts[i+1]);
      tx = await handsOnLabTmp.doLab(1);
      tx = await tx.wait();
      console.log("Tx of doLab", tx.blockNumber, tx.transactionHash);
      let addr = await accounts[i+1].getAddress();
      let stu = await handsOnLabTmp.getStudentLab(addr, 1);
      console.log("Studnet Info:", stu.stuName, stu.stuAddr, stu.labAddr);
      tx = await iLab.getLabAddress(stu.stuAddr);
      expect(tx).to.equal(stu.labAddr);
    }
  })

  it("Test Lab1", async function() {
    factory = await ethers.getContractFactory("Lab1");
    for(let i=0; i<names.length; i++)
    {
      let addr = await accounts[i+1].getAddress();
      let stu = await handsOnLab.getStudentLab(addr, 1);
      console.log("Studnet Info:", stu.stuName, stu.stuAddr, stu.labAddr);
      lab = await factory.attach(stu.labAddr);
      tx = await lab.isCompleted();
      console.log("isCompleted before doLab:", tx);
      tx = await lab.doLab();
      tx = await tx.wait();
      tx = await lab.isCompleted();
      console.log("isCompleted after doLab:", tx);
      expect(tx).to.be.true;
    }
  })
  
})
