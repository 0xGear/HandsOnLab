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
  mapping(address => mapping(address => uint)) Token;

  function name(address tokenAddr) public view returns (string memory){
    return IERC20(tokenAddr).name();
  }
  function symbol(address tokenAddr) public view returns (string memory){
    return IERC20(tokenAddr).symbol();
  }
  function decimals(address tokenAddr) public view returns (uint8){
    return IERC20(tokenAddr).decimals();
  }
  function deposit(address tokenAddr, uint amount) public {
    IERC20 token = IERC20(tokenAddr);
    require(token.allowance(msg.sender, address(this)) >= amount, 'approval amount not enough');
    token.transferFrom(msg.sender, address(this), amount);
    Token[tokenAddr][msg.sender] = amount;
  }
  function withdraw(address tokenAddr, uint amount) public {
    require(Token[tokenAddr][msg.sender] >= amount, 'balance not enough');
    IERC20 token = IERC20(tokenAddr);
    token.transfer(msg.sender, amount);
    Token[tokenAddr][msg.sender] -= amount;
  }
  function balanceOf(address tokenAddr) public view returns (uint) {
    return Token[tokenAddr][msg.sender];
  }
}
