import { ethers } from "hardhat";
import { Contract, Signer, BigNumber } from "ethers";
import { expect, assert } from "chai";

let accounts: Signer[];
let account1: Signer;
let account2: Signer;
let account3: Signer;
let tokenA: Contract;
let tokenB: Contract;
let tokenBank: Contract;
let addr1: any;
let addr2: any;
let addr3: any;
let tx: any;
let transferNum = BigNumber.from(`10`);
let approveNum = BigNumber.from(`55`);
let totalSupplyA = BigNumber.from(`1000`);
let totalSupplyB = BigNumber.from(`1000000`);
/*
async function getAccountInfo(Contract contract){
  let balance1 = (await contract.balanceOf(addr1)).toString();
  let balance2 = (await contract.balanceOf(addr2)).toString();
  let allowance1 = (await contract.allowance(addr1, addr2)).toString();
  let allowance2 = (await contract.allowance(addr2, addr1)).toString();
  console.log("Balance of account1:", balance1);
  console.log("Balance of account2:", balance2);
  console.log("Allowance of account1:", allowance1);
  console.log("Allowance of account2:", allowance2);
}
*/
describe("Test ERC20Token Contract", function(){
  before(async () => {
    [account1, account2, account3] = await ethers.getSigners();
    addr1 = await account1.getAddress();
    addr2 = await account2.getAddress();
    addr3 = await account3.getAddress();
    console.log("Account1:", addr1);
    console.log("Account2:", addr2);
    console.log("Account3:", addr3);
  })

  it("Deploy ERC20Token contract", async function() {
    let factory = await ethers.getContractFactory("ERC20Token");
    tokenA = await factory.deploy('tokenA', 'TA', 18, totalSupplyA);
    tokenB = await factory.deploy('tokenB', 'TB', 10, totalSupplyB);
    await tokenA.deployed();
    await tokenB.deployed();
    console.log("Addr of TokenA:", tokenA.address);
    console.log("Name:", await tokenA.name());
    console.log("Symbol:", await tokenA.symbol());
    console.log("Decimals:", await tokenA.decimals());
    
    console.log("Addr of TokenB:", tokenB.address);
    console.log("Name:", await tokenB.name());
    console.log("Symbol:", await tokenB.symbol());
    console.log("Decimals:", await tokenB.decimals());
  })

  it("Deploy TokenBank contract", async function() {
    let factory = await ethers.getContractFactory("TokenBank");
    tokenBank = await factory.deploy();
    await tokenBank.deployed();
    console.log('Addr of TokenBank:', tokenBank.address);
    let symbol = await tokenA.symbol();
    let addr = tokenA.address;
    await tokenBank.registerToken(symbol, addr);
    console.log("Name:", await tokenBank.name(symbol));
    console.log("Name:", await tokenBank.symbol(symbol));
    console.log("Name:", await tokenBank.decimals(symbol));

  })
  
  it.skip("Attach ERC20Token contract", async function() {
    let tokenAddr = `0x5FbDB2315678afecb367f032d93F642f64180aa3`;
    let factory = await ethers.getContractFactory("ERC20Token");
    tokenA = await factory.attach(tokenAddr);
    console.log("Addr of ERC20Token:", tokenA.address);
    console.log("Name:", await tokenA.name());
    console.log("Symbol:", await tokenA.symbol());
    console.log("Decimals:", await tokenA.decimals());
  })

  it.skip("Test transfer and balanceOf functions", async function() {
    tokenA = await tokenA.connect(account1);
    let balance = await tokenA.balanceOf(addr2);
    tx = await tokenA.transfer(addr2, transferNum);
    await tx.wait();
    let newBalance = (await tokenA.balanceOf(addr2)).toString();
    
    let v1 = balance.add(transferNum);
    let v2 = BigNumber.from(newBalance);

    expect(v1).to.equal(v2);
  })

  it.skip("Test approve, allowance, and transferFrom functions", async function() {
    tokenA = await tokenA.connect(account1);
    tx = await tokenA.approve(addr2, approveNum);
    await tx.wait();
    let allowance = await tokenA.allowance(addr1, addr2);
    expect(allowance).to.equal(approveNum);
    let balance = await tokenA.balanceOf(addr3);
    tokenA = await tokenA.connect(account2);
    tx = await tokenA.transferFrom(addr1, addr3, allowance);
    await tx.wait();
    let newBalance = await tokenA.balanceOf(addr3);
    expect(newBalance).to.equal(balance.add(allowance));
    allowance = await tokenA.allowance(addr1, addr2);
    expect(allowance).to.equal(BigNumber.from(`0`));
  })

})
