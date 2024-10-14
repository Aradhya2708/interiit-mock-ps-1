import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the creator of the project
        required: true,
    },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of collaborators
    repositoryUrl: {
        type: String,
        required: true, // URL to the GitHub repository
    },
    paymentAmount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

projectSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Project = mongoose.model('Project', projectSchema);
export default Project;