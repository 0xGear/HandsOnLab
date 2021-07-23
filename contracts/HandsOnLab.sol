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
  function reward() external view returns (uint reward);
  function createLab(address addr) external returns (bool success);
  function getLabAddress(address addr) external view returns (address labAddr);
  function isCompleted(address addr) external view returns (bool isCompleted);
}

contract HandsOnLab is Owned {
  struct Student{
    string name;
    address addr;
    bool exist;
    mapping(uint => address) labs;
    mapping(uint => bool) isCompleted;
  }
  
  BlueGearToken token;
  uint public iLabNum;
  uint public studentNum;
  mapping(uint => address) public iLabs;
  mapping(address => Student) private students; 

  event SetToken(address indexed from, address indexed tokenAddr);
  event SetILabAddr(address indexed from, uint indexed index, address indexed iLabAddr);
  event Register(address indexed from, string indexed name);
  event DoLab(address indexed from, uint indexed index);
  
  function changeOwner(address nextOwner) public onlyOwner returns (bool success) {
    owner = payable(nextOwner);
    return true;
  }

  function setToken(address addr) public onlyOwner returns (bool success) {
    token = BlueGearToken(addr); 
    emit SetToken(msg.sender, addr);
    return true;
  }

  function getToken() public view returns (address tokenAddr) {
    return address(token);
  }

  function setILabAddr(uint index, address iLabAddr) public onlyOwner returns (bool success) {
    if(iLabs[index] == address(0)){
      iLabNum += 1;
    }
    iLabs[index] = iLabAddr;
    emit SetILabAddr(msg.sender, index, iLabAddr);
    return true;
  }

  function getILabAddr(uint index) public view returns (address iLabAddr) {
    return iLabs[index];
  }
  
  function register(string memory _name) public returns (bool success) {
    require(students[msg.sender].exist == false);
    studentNum += 1;
    Student storage s = students[msg.sender];
    s.name = _name;
    s.addr = msg.sender;
    s.exist = true;
    emit Register(msg.sender, _name);
    return true;
  }

  function doLab(uint index) public returns (bool success) {
    ILab iLab = ILab(iLabs[index]);
    iLab.createLab(msg.sender);
    students[msg.sender].labs[index] = iLab.getLabAddress(msg.sender);
    emit DoLab(msg.sender, index);
    return true;
  }
  
  function getStudentName(address addr) public view returns (string memory name) {
    return students[addr].name;
  }

  function getStudentLabAddr(address addr, uint index) public view returns (address labAddr) {
    return students[addr].labs[index];
  }

  function checkStudentLab(address addr, uint index) public returns (bool success) {
    ILab iLab = ILab(iLabs[index]);
    bool complete_flag = iLab.isCompleted(addr);
    if(complete_flag && students[addr].isCompleted[index] == false){
      token.reward(addr, iLab.reward());
    } 
    students[addr].isCompleted[index] = complete_flag; 
    return true;
  }
  
  function isStudentLabCompleted(address addr, uint index) public view returns (bool isCompleted) {
    return students[addr].isCompleted[index];
  }
}
