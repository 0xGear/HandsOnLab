//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.6;

interface IERC20 {

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
  mapping(string => address) token;

  function registerToken(string symbol, address tokenContract) public {
    mapping[symbol] = tokenContract; 
  }
  function deposit(string symbol, uint amount) public {
    address tokenAddr = token[symbol];
    IERC20(tokenAddr).
  }
}
