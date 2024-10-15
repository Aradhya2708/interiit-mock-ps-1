import Web3 from 'web3';
import contractABI from './path-to-compiled-contract.json' // Your contract's ABI
import "dotenv/config"
import { CONTRACT_BYTECODE } from '../contracts/escrowABI.json'; // Store config safely

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));

export const deploySmartContract = async (contribution, project) => {
    try {
        const account = web3.eth.accounts.privateKeyToAccount(process.env.WALLET_PRIVATE_KEY);
        web3.eth.accounts.wallet.add(account);

        const contract = new web3.eth.Contract(contractABI);
        const gasEstimate = await contract.deploy({
            data: CONTRACT_BYTECODE,
            arguments: [contribution.freelancerId, project.paymentAmount]
        }).estimateGas();

        const contractInstance = await contract.deploy({
            data: CONTRACT_BYTECODE,
            arguments: [contribution.freelancerId, project.paymentAmount] // Pass constructor arguments
        }).send({
            from: account.address,
            gas: gasEstimate
        });

        // Save the deployed contract address in the contribution
        contribution.smartContractAddress = contractInstance.options.address;
        await contribution.save();

        console.log('Smart contract deployed at:', contractInstance.options.address);
    } catch (error) {
        console.error('Error deploying contract:', error);
        throw new Error('Smart contract deployment failed.');
    }
};

export const triggerSmartContract = async (contribution) => {
    try {
        const account = web3.eth.accounts.privateKeyToAccount(process.env.WALLET_PRIVATE_KEY);
        web3.eth.accounts.wallet.add(account);

        // Retrieve the deployed contract instance
        const contract = new web3.eth.Contract(contractABI, contribution.smartContractAddress);

        // Call the function that releases the payment
        const gasEstimate = await contract.methods.releasePayment().estimateGas({ from: account.address });
        await contract.methods.releasePayment().send({
            from: account.address,
            gas: gasEstimate
        });

        console.log('Payment released to freelancer:', contribution.freelancerId);
    } catch (error) {
        console.error('Error triggering smart contract payment:', error);
        throw new Error('Failed to release payment.');
    }
};
