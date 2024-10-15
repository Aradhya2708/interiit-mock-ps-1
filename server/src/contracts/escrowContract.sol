// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
    address public employer;
    address public freelancer;
    uint256 public amount;
    bool public isApproved = false;

    constructor(address _freelancer) payable {
        employer = msg.sender; // The one deploying the contract is the employer
        freelancer = _freelancer;
        amount = msg.value; // Amount deposited during contract creation
    }

    // Function to approve the contribution
    function approve() public {
        require(msg.sender == employer, "Only employer can approve");
        isApproved = true;
    }

    // Function to release funds
    function releaseFunds() public {
        require(isApproved, "Funds not approved for release");
        require(address(this).balance > 0, "No funds to release");

        // Transfer funds to freelancer
        payable(freelancer).transfer(address(this).balance);
        isApproved = false; // Reset approval status for security
    }

    // Function to get the contract balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}