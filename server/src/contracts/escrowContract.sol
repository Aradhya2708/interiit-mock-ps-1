// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
    address public employer;
    address public freelancer;
    uint256 public amount;
    uint256 public deadline;
    uint256 public submissionDeadline;
    bool public isApproved = false;
    bool public isSubmitted = false;

    event Approved(address employer);
    event FundsReleased(address freelancer, uint256 amount);
    event ContractCancelled(address employer, address freelancer);
    event RevisionRequested(address employer);
    event AutoApproved(address freelancer);

    constructor(address _freelancer, uint256 _deadline) payable {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        employer = msg.sender; // The one deploying the contract is the employer
        freelancer = _freelancer;
        amount = msg.value; // Amount deposited during contract creation
        deadline = _deadline;
    }

    // Function to approve the contribution
    function approve() public {
        require(msg.sender == employer, "Only employer can approve");
        require(isSubmitted, "Work has not been submitted yet");
        require(block.timestamp <= submissionDeadline, "Submission deadline has passed");
        isApproved = true;
        emit Approved(employer);
    }

    // Function to release funds
    function releaseFunds() public {
        require(isApproved, "Funds not approved for release");
        require(address(this).balance > 0, "No funds to release");
        require(block.timestamp <= deadline, "Deadline has passed");

        // Transfer funds to freelancer
        payable(freelancer).transfer(address(this).balance);
        isApproved = false; // Reset approval status for security
        emit FundsReleased(freelancer, amount);
    }

    // Function to cancel the contract if the deadline is not met
    function cancelContract() public {
        require(block.timestamp > deadline, "Deadline has not passed yet");
        require(msg.sender == employer, "Only employer can cancel the contract");

        // Transfer funds back to employer
        payable(employer).transfer(address(this).balance);
        emit ContractCancelled(employer, freelancer);
    }

    // Function to request a revision
    function requestRevision() public {
        require(msg.sender == employer, "Only employer can request a revision");
        require(block.timestamp <= deadline, "Deadline has passed");
        isSubmitted = false;
        emit RevisionRequested(employer);
    }

    // Function to submit work
    function submitWork() public {
        require(msg.sender == freelancer, "Only freelancer can submit work");
        require(block.timestamp <= deadline, "Deadline has passed");
        isSubmitted = true;
        submissionDeadline = block.timestamp + 3 days; // Employer has 3 days to approve
    }

    // Function to auto-approve if employer does not respond within submission deadline
    function autoApprove() public {
        require(isSubmitted, "Work has not been submitted yet");
        require(block.timestamp > submissionDeadline, "Submission deadline has not passed");
        isApproved = true;
        emit AutoApproved(freelancer);
    }

    // Function to get the contract balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}