//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.5;

import "./RobinetToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/** @title Faucet for RobinetToken.
 *  @author Sylvie, Jonathan, Nassim et Victor (équipe rouge).
 */

contract Faucet is Ownable {
    RobinetToken private _Robinet;
    mapping(address => uint256) private _claimTokens;
    uint256 private _timeLeft;
    uint256 private _supplyInStock;
    uint256 private _deadLine;

    /** @dev This event is triggered right after a user claims Tokens.
     * You can see the user's address and the amount of Tokens claimed.
     */

    event RobinetTransfer(address indexed recipient, uint256 amount);

    /** @notice Faucet for RobinetToken ERC-20 token contract.
     * Users can only claim 100 Tokens each time, then reclaim more only 3 days after.
     *
     * @param robinet to set the Token address (RobinetToken).
     *
     * @dev _deadline is the time limit between each Token claiming.
     * _supplyInStock is the exact amount of Tokens left to claim.
     */

    constructor(address robinet) {
        _Robinet = RobinetToken(robinet);
        require(msg.sender == _Robinet.owner(), "Faucet: Only owner can deploy this contract");
        _supplyInStock = _Robinet.balanceOf(owner());
        _deadLine = 3 days;
    }

    /** @dev This modifier checks if the users can reclaim more Tokens.
     */

    modifier goodTime() {
        require(
            block.timestamp >= _claimTokens[msg.sender],
            "Faucet: You need to wait 3 days before reclaim new Tokens"
        );
        _;
    }

    /** @dev This is the main function in this contract.
     * require checks if there is enough Token left to claim.
     * Then _claimTokens[msg.sender] set the claiming time plus the time limit
     * so the contract can knows exactly when the users can claim Tokens again .
     */
    function claim() public goodTime() {
        require(_supplyInStock != 0, "Faucet: No more Token to claim");
        _claimTokens[msg.sender] = block.timestamp + _deadLine;
        uint256 amountRobinet = 100 * 10**_Robinet.decimals();
        _Robinet.transferFrom(owner(), msg.sender, amountRobinet);
        _supplyInStock -= amountRobinet;
        emit RobinetTransfer(msg.sender, amountRobinet);
    }

    /** @dev Getter to check the time left they have before claiming new Tokens
     */
    function timeLeft() public view returns (uint256) {
        return (_claimTokens[msg.sender] - block.timestamp);
    }

    /** @dev Getter to check the Token contract address.
     */
    function tokenContractAddress() public view returns (address) {
        return address(_Robinet);
    }

    /** @dev Getter to check the Token owner's address.
     */
    function tokenOwner() public view returns (address) {
        return address(owner());
    }

    /** @dev Getter to check the amount of Token left to claim.
     */
    function supplyInStock() public view returns (uint256) {
        return _supplyInStock;
    }
}
