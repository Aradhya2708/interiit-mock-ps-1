import express from 'express';
import {
    approveContribution,
    submitPullRequest,
    checkContributionStatus,
    getContributionsForProject,
} from '../controllers/contributionController.js';

const router = express.Router();

// Route to get contributions for a specific project
router.get('/project/:projectId', getContributionsForProject);

// Route to approve a contribution
router.post('/:projectId/:contributionId/approve', approveContribution);

// Route to submit a PR for a contribution
router.post('/:contributionId/submit-pr', submitPullRequest);

// Route to check the contribution status (e.g., PR merged or not)
router.get('/:contributionId/check-status', checkContributionStatus);

export default router;
