//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.6;
import "hardhat/console.sol";
interface IERC20 {
  function name() external view returns (string memory);
  function symbol() external view returns (string memory);
  function decimals() external view returns (uint8);

  function totalSupply() external view returns (uint256);
  function balanceOf(address account) external view returns (uint256);
  function allowance(address owner, address spender) external view returns (uint256);

  function transfer(address recipient, uint256 amount) external returns (bool);
  function approve(address spender, uint256 amount) external returns (bool);
  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);


  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract TokenBank{
  mapping(string => address) tokenAddr;

  function registerToken(string memory sym, address _tokenAddr) public {
    tokenAddr[sym] = _tokenAddr;
  }
  function name(string memory sym) public view returns (string memory){
    return IERC20(tokenAddr[sym]).name();
  }
  function symbol(string memory sym) public view returns (string memory){
    return IERC20(tokenAddr[sym]).symbol();
  }
  function decimals(string memory sym) public view returns (uint8){
    return IERC20(tokenAddr[sym]).decimals();
  }
  function deposit(string memory sym, uint amount) public {
  }
}
