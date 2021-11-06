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
  })
  
  it("Deposit & Withdraw TokenA", async function() {
    let amount = BigNumber.from(`10`);
    await expect(tokenBank.deposit(tokenA.address, amount)).to.be.revertedWith('approval amount not enough');
    await tokenA.approve(tokenBank.address, amount);
    await tokenBank.deposit(tokenA.address, amount);
    let balanceOf = await tokenBank.balanceOf(tokenA.address);
    expect(balanceOf).to.equal(amount);

    amount = BigNumber.from(`20`);
    await expect(tokenBank.withdraw(tokenA.address, amount)).to.be.revertedWith('balance not enough');
    amount = BigNumber.from(`5`);
    let beforeWithdraw = await tokenBank.balanceOf(tokenA.address);
    tokenBank.withdraw(tokenA.address, amount);
    let remain = await tokenBank.balanceOf(tokenA.address);
    expect(remain).to.equal(beforeWithdraw.sub(amount));
  })
  
  it("Deposit & Withdraw TokenB", async function() {
    let amount = BigNumber.from(`10`);
    await expect(tokenBank.deposit(tokenB.address, amount)).to.be.reverted;
    await tokenB.approve(tokenBank.address, amount);
    await tokenBank.deposit(tokenB.address, amount);
    let balanceOf = await tokenBank.balanceOf(tokenB.address);
    expect(balanceOf).to.equal(amount);

    amount = BigNumber.from(`20`);
    await expect(tokenBank.withdraw(tokenB.address, amount)).to.be.revertedWith('balance not enough');
    amount = BigNumber.from(`5`);
    let beforeWithdraw = await tokenBank.balanceOf(tokenB.address);
    tokenBank.withdraw(tokenB.address, amount);
    let remain = await tokenBank.balanceOf(tokenB.address);
    expect(remain).to.equal(beforeWithdraw.sub(amount));
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


})
