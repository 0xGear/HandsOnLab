//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.6;
import "./BlueGearToken.sol";
import "hardhat/console.sol";

contract Owned {
  address payable owner;
  constructor() {
    owner = payable(msg.sender);
  }

  modifier onlyOwner{
    require(msg.sender == owner, "only owner can call this function");
    _;
  }
}

interface ILab {
  function createLab(address addr) external returns (bool);
  function getLabAddress(address addr) external view returns (address);
  function isCompleted(address addr) external view returns (bool);
}

contract HandsOnLab is Owned {
  struct Student{
    string name;
    address addr;
    mapping(uint => address) labs;
    mapping(uint => bool) record;
  }
  
  BlueGearToken token;
  uint studentCount;
  mapping(uint => address) private labs;
  mapping(address => Student) private students; 

  event SetToken(address indexed from, address indexed tokenAddr);
  event SetLab(address indexed from, uint indexed index, address indexed labAddr);
  event Register(address indexed from, string indexed name);
  event DoLab(address indexed from, uint indexed index);

  function setToken(address addr) public onlyOwner returns (bool success) {
    token = BlueGearToken(addr); 
    emit SetToken(msg.sender, addr);
    return true;
  }

  function getToken() public view returns (address tokenAddr) {
    return address(token);
  }

  function setLab(uint index, address addr) public onlyOwner returns (bool success) {
    labs[index] = addr;
    emit SetLab(msg.sender, index, addr);
    return true;
  }

  function getLab(uint index) public view returns (address labAddr) {
    return labs[index];
  }

  function doLab(uint index) public returns (bool success) {
    ILab ilab = ILab(labs[index]);
    ilab.createLab(msg.sender);
    students[msg.sender].labs[index] = ilab.getLabAddress(msg.sender);
    emit DoLab(msg.sender, index);
    return true;
  }
  
  function register(string memory _name) public returns (bool success) {
    Student storage s = students[msg.sender];
    s.name = _name;
    s.addr = msg.sender;
    studentCount += 1;
    emit Register(msg.sender, _name);
    return true;
  }

  function getStudentNum() public view returns (uint num) {
    return studentCount;
  }

  function getStudentLab(address addr, uint index) public view returns (string memory stuName, address stuAddr, address labAddr) {
    return (students[addr].name, students[addr].addr, students[addr].labs[index]);
  }

}
