//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.6;

contract Lab1 {
  bool public isCompleted = false;

  event DoLab(address indexed from);

  function doLab() public returns (bool success) {
    isCompleted = true;
    emit DoLab(msg.sender);
    return true;
  }
}
