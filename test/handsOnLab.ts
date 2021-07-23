import { ethers } from "hardhat";
import { ContractFactory, Contract, Signer, BigNumber} from "ethers";
import { expect, assert } from "chai";

let accounts: Signer[];
let signer: Signer;
let handsOnLab: Contract;
let blueGearToken: Contract;
let iLab: Contract;
let lab: Contract;
let factory: ContractFactory;
let signerAddr: any;
let labAddr: any;
let tx: any;
let value: any;
let names = ["Alice", "Bob", "Charles"];
let testILab = "ILab0";
let testLab = "Lab0";

describe("Test Hands-on-Lab", function(){
  before(async () => {
    accounts = await ethers.getSigners();
    signer = accounts[0];
    signerAddr = await signer.getAddress();
    console.log("Signer:", signerAddr);
    
    //deploy BlueGearToken contract
    factory = await ethers.getContractFactory("BlueGearToken");
    blueGearToken = await factory.deploy();
    console.log("Addr of BlueGearToken:", blueGearToken.address);
    tx = await blueGearToken.deployTransaction.wait();
    console.log("Tx receipt:", tx.blockNumber, tx.transactionHash);
    console.log("Owner:", await blueGearToken.owner());
    console.log("Rewarder:", await blueGearToken.rewarder());
    let supply = (await blueGearToken.totalSupply()).toString();
    console.log("Total supply of BlueGear Coin:", supply);

    //deploy HandsOnLab contract
    factory = await ethers.getContractFactory("HandsOnLab");
    handsOnLab = await factory.deploy();
    console.log("Addr of HandsOnLab:", handsOnLab.address);
    tx = await handsOnLab.deployTransaction.wait();
    console.log("Tx receipt:", tx.blockNumber, tx.transactionHash);
    let labNum = (await handsOnLab.iLabNum()).toString();
    console.log("# of labs:", await labNum);
    let stuNum = (await handsOnLab.studentNum()).toString();
    console.log("# of students:", stuNum);
    
    //deploy iLab contract
    factory = await ethers.getContractFactory(testILab);
    iLab = await factory.deploy(10);
    console.log("Addr of ILab:", iLab.address);
    tx = await iLab.deployTransaction.wait();
    console.log("Tx receipt:", tx.blockNumber, tx.transactionHash);
    let reward = (await iLab.reward()).toString();
    console.log("Reward of iLab:", reward);
  })

  it("Test setReward function", async function() {
    tx = await blueGearToken.setRewarder(handsOnLab.address);
    tx = await tx.wait();
    console.log("Tx of setToken:", tx.blockNumber, tx.transactionHash);
    let rewarder = await blueGearToken.rewarder();
    console.log("Rewarder of BlueGear Coin:", rewarder);
    expect(rewarder).to.equal(handsOnLab.address);

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

  it("Test setLab, and getLab function", async function() {
    tx = await handsOnLab.setILabAddr(1, iLab.address);
    tx = await tx.wait();
    console.log("Tx of setILabAddr:", tx.blockNumber, tx.transactionHash);
    tx = await handsOnLab.getILabAddr(1);
    console.log("Rst of getILabAddr:", tx);
    expect(tx).to.equal(iLab.address);
  })

  it("Test register and getStudent fucntion", async function() {
    console.log("Signer of HandsOnLab:", await handsOnLab.signer.getAddress());
    for(let i=0; i<names.length; i++)
    {
      let handsOnLabTmp = await handsOnLab.connect(accounts[i+1]);
      tx = await handsOnLabTmp.register(names[i]);
      tx = await tx.wait();
      let num = (await handsOnLab.studentNum()).toString();
      let addr = await accounts[i+1].getAddress();
      let name = await handsOnLab.getStudentName(addr);
      console.log("Student Name:",num, name, addr);
      expect(name).to.equal(names[i]);
    }
  })
  
  it("Test doLab function", async function() {
    for(let i=0; i<names.length; i++)
    {
      let handsOnLabTmp = await handsOnLab.connect(accounts[i+1]);
      tx = await handsOnLabTmp.doLab(1);
      tx = await tx.wait();
      console.log("Tx of doLab", tx.blockNumber, tx.transactionHash);
      let stuAddr = await accounts[i+1].getAddress();
      let labAddr = await handsOnLabTmp.getStudentLabAddr(stuAddr, 1);
      tx = await iLab.getLabAddress(stuAddr);
      expect(tx).to.equal(labAddr);
    }
  })

  it("Test Lab", async function() {
    factory = await ethers.getContractFactory(testLab);
    for(let i=0; i<names.length; i++)
    {
      handsOnLab = await handsOnLab.connect(accounts[i+1]);
      let stuAddr = await accounts[i+1].getAddress();
      console.log("Addr of student:", stuAddr);
      let labAddr = await handsOnLab.getStudentLabAddr(stuAddr, 1);
      lab = await factory.attach(labAddr);
      tx = await lab.isCompleted();
      console.log("[before - Lab] isCompleted:", tx);
      tx = await iLab.isCompleted(stuAddr);
      console.log("[before - iLab] isCompleted:", tx);
      tx = await handsOnLab.isStudentLabCompleted(stuAddr, 1);
      console.log("[before - HandsOnLab] isCompleted:", tx);
      tx = await lab.doLab();
      tx = await tx.wait();
      tx = await lab.isCompleted();
      console.log("[after - Lab] isCompleted:", tx);
      tx = await iLab.isCompleted(stuAddr);
      console.log("[after - iLab] isCompleted:", tx);
      tx = await handsOnLab.checkStudentLab(stuAddr, 1);
      await tx.wait();
      tx = await handsOnLab.isStudentLabCompleted(stuAddr, 1);
      console.log("[after - HandsOnLab]isCompleted:", tx);
      expect(tx).to.be.true;
      
      let supply = (await blueGearToken.totalSupply()).toString();
      console.log("Total supply of BGC:", supply);
      let bal = (await blueGearToken.balanceOf(stuAddr)).toString();
      console.log("Balance of", names[i], bal);
    }
  })
  
})
