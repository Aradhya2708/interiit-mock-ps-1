import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'pr_submitted', 'completed'],
        default: 'pending',
    },
    contractAddress: {
        type: String
    }, // Address of the deployed smart contract [add when pending->approved]
    pullRequestUrl: {
        type: String
    }, // Store pull request URL [add when approved->pr_submitted]
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Contribution = mongoose.model('Contribution', contributionSchema);
export default Contribution;