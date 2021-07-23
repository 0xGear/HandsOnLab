//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.6;
import "./Lab1.sol";

contract ILab1 {
  uint public reward;
  mapping(address => Lab1) labs;

  event CreateLab(address indexed from);
  
  constructor(uint _reward) {
    reward = _reward;
  }

  function createLab(address addr) public returns (bool success){
    labs[addr] = new Lab1();
    emit CreateLab(addr);
    return true;
  }
  function getLabAddress(address addr) public view returns (address labAddr){
    return address(labs[addr]);
  }
  function isCompleted(address addr) public view returns (bool complete){
    return labs[addr].isCompleted();
  }
}
