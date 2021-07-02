// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title RobinetToken
/// @author Red Team : Jonathan, Victor, Nassim et Sylvie

contract RobinetToken is ERC20, Ownable {
    constructor(uint256 totalSupply_) ERC20("RobinetToken", "RBT") {
        _mint(msg.sender, totalSupply_ * 10**decimals());
    }
}
