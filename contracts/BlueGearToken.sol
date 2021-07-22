//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.6;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IERC20 {
  function totalSupply() external view returns (uint256);
  function balanceOf(address account) external view returns (uint256);
  function transfer(address recipient, uint256 amount) external returns (bool);
  function allowance(address owner, address spender) external view returns (uint256);
  function approve(address spender, uint256 amount) external returns (bool);
  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract BlueGearToken is IERC20{
  using SafeMath for uint;
  string public symbol;
  string public name;
  uint8 public decimals;
  uint private _totalSupply;
  address public owner;

  mapping(address => uint) balances;
  mapping(address => mapping(address => uint)) allowed;
  
  constructor(){
    symbol = "BGC";
    name = "BlueGear Coin";
    decimals = 8;
    _totalSupply = 100000000000;
    owner = msg.sender;
    _mint(msg.sender, 1000 * 10 ** uint(decimals));
  }

  function totalSupply() public view override returns (uint) {
    return _totalSupply;
  }

  function balanceOf(address tokenOwner) public view override returns (uint balance) {
    return balances[tokenOwner];
  }

  function transfer(address to, uint tokens) public override returns (bool success) {
    balances[msg.sender] = balances[msg.sender].sub(tokens);
    balances[to] = balances[to].add(tokens);
    emit Transfer(msg.sender, to, tokens);
    return true;
  }

  function approve(address spender, uint tokens) public override returns (bool success) {
    allowed[msg.sender][spender] = tokens;
    emit Approval(msg.sender, spender, tokens);
    return true;
  }

  function transferFrom(address from, address to, uint tokens) public override returns (bool success) {
    balances[from] = balances[from].sub(tokens);
    allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
    balances[to] = balances[to].add(tokens);
    emit Transfer(from, to, tokens);
    return true;
  }

  function allowance(address tokenOwner, address spender) public view override returns (uint remaining) {
    return allowed[tokenOwner][spender];
  }

  function _mint(address _to, uint amount) private {
    require(msg.sender == owner);
    require(_to != address(0), "BGC: mint to the zero address");
    balances[_to] = amount;
  }
}
