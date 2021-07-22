//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.6;
import "./Lab1.sol";

contract ILab1 {
  mapping(address => Lab1) labs;

  event CreateLab(address indexed from);
  
  function createLab(address addr) public returns (bool){
    labs[addr] = new Lab1();
    emit CreateLab(addr);
    return true;
  }
  function getLabAddress(address addr) public view returns (address){
    return address(labs[addr]);
  }
  function isCompleted(address addr) public view returns (bool){
    return labs[addr].isCompleted();
  }
}
