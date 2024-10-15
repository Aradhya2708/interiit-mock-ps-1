# **Trustless Freelancer Contribution Platform (Web3)**

A decentralized platform built using blockchain technology where freelancers can contribute to projects, and employers can reward them via smart contracts once the contribution is completed.

## **Table of Contents**
- [Introduction](#introduction)
- [Features](#features)
- [Workflow](#workflow)
- [Smart Contract Integration](#smart-contract-integration)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)

## **Introduction**

The Freelancer Contribution Platform is designed to connect freelancers with projects, allowing them to contribute to repositories. Employers can approve contributions, which triggers the creation of smart contracts to facilitate payments automatically when the contribution is verified (i.e., when a GitHub pull request is merged).

This platform integrates Web3 functionality by leveraging GitHub OAuth for authentication and MetaMask for wallet interactions, and uses smart contracts to securely manage freelancer payments.

## **Features**

- **GitHub OAuth**: Freelancers log in using GitHub OAuth and are assigned tasks based on their contributions.
- **MetaMask Wallet Integration**: Freelancers can connect their wallet using MetaMask, or manually enter their wallet address.
- **Smart Contracts**: Once a contribution is approved and a PR is merged, a smart contract is automatically triggered to handle payments.
- **Contribution Management**: Employers can manage contributions and verify the status of PRs, while freelancers can check the status of their contributions.

## **Workflow**

1. **Login via GitHub**: Freelancers log in using their GitHub account. If they are new, they will be prompted to connect their wallet via MetaMask or provide a wallet address manually.
2. **Submit Contribution Request**: Freelancers browse through projects and request to contribute. This request is sent to the employer.
3. **Employer Approval**: Once the employer approves the freelancer's request, a smart contract is deployed for that contribution.
4. **Submit Pull Request**: Freelancers submit their work through a GitHub pull request. They must provide the PR URL in the platform.
5. **Check Contribution Status**: Freelancers can check the status of their contribution. If the PR is merged, the smart contract will trigger and release payment to the freelancer’s wallet.
6. **Smart Contract Execution**: After the PR is accepted, the smart contract releases payment to the freelancer.

## **Smart Contract Integration**

- **Approval Stage**: Upon approval, the employer creates a smart contract for the freelancer’s contribution.
- **Triggering the Contract**: Once the GitHub pull request is merged, the smart contract automatically releases the payment to the freelancer’s wallet.
- **Wallet Integration**: MetaMask is used for the freelancer's wallet connection, and payments are handled using Ethereum smart contracts.

## **Tech Stack**

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: HTML, JavaScript (with MetaMask integration)
- **Web3**: Solidity, Ethereum Smart Contracts, MetaMask
- **Authentication**: GitHub OAuth
   
## API Endpoints
- POST ```/auth/login```: Initiate GitHub OAuth login.
- GET ```/auth/callback```: Handle GitHub OAuth callback.
- POST ```/auth/enter-wallet```: Add wallet address (MetaMask/manual).
- POST ```/project/:projectId/contribute```: Freelancer requests to contribute to a project.
- POST ```/contribution/:contributionId/submit-pr```: Freelancer submits the pull request URL.
- POST ```/contribution/:projectId/:contributionId/approve```: Employer approves contribution and deploys smart contract.
- GET ```/contribution/:contributionId/check-status```: Freelancer checks PR status and triggers smart contract if PR is merged.

## Contributors
- [Aradhya Mahajan](https://www.linkedin.com/in/aradhya-mahajan-61ab5a27b/)
