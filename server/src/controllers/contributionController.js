import Contribution from '../models/contributionModel.js';
import Project from '../models/projectModel.js';
import axios from 'axios';

// Controller to approve a contribution
export const approveContribution = async (req, res) => {
    const { projectId, contributionId } = req.params;

    try {
        const contribution = await Contribution.findById(contributionId);
        if (!contribution) return res.status(404).json({ message: 'Contribution not found' });

        contribution.status = 'approved';
        await contribution.save();

        const project = await Project.findById(projectId);
        if (!project.collaborators.includes(contribution.freelancerId)) {
            project.collaborators.push(contribution.freelancerId);
            await project.save();
        }

        // Here you would deploy the smart contract
        // Example: deploySmartContract(contribution, project);

        res.status(200).json({ message: 'Contribution approved and smart contract deployed.' });
    } catch (error) {
        res.status(500).json({ message: 'Error approving contribution.' });
    }
};

// Controller to submit a pull request for a contribution
export const submitPullRequest = async (req, res) => {
    const { contributionId } = req.params;
    const { pullRequestUrl } = req.body;

    try {
        const contribution = await Contribution.findById(contributionId);
        if (!contribution) return res.status(404).json({ message: 'Contribution not found' });

        if (contribution.status != 'approved') return res.status(400).json({ message: 'Contribution not approved' });

        contribution.pullRequestUrl = pullRequestUrl;
        contribution.status = 'pr_submitted';
        await contribution.save();

        res.status(200).json({ message: 'Pull request submitted and status updated.' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting pull request.' });
    }
};

// Controller to check the status of a contribution
export const checkContributionStatus = async (req, res) => {
    const { contributionId } = req.params;

    try {
        const contribution = await Contribution.findById(contributionId);
        if (!contribution || !contribution.pullRequestUrl) {
            return res.status(404).json({ message: 'No PR found for this contribution.' });
        }

        // Parse the PR URL
        const { repoOwner, repoName, prNumber } = parsePRUrl(contribution.pullRequestUrl);

        // Check PR merge status using GitHub API : https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#check-if-a-pull-request-has-been-merged
        const githubResponse = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${prNumber}/merge`, {
            headers: {
                Authorization: `token ${process.env.GITHUB_TOKEN}`, // what token??
            },
        });

        if (githubResponse.status === 204) {
            contribution.status = 'completed';
            await contribution.save();

            // Trigger the smart contract to release payment
            // Example: triggerSmartContract(contribution);

            res.status(200).json({ message: 'PR merged, payment released.' });
        } else {
            res.status(400).json({ message: 'PR not merged yet.' });
        }
    } catch (error) {
        if (error.response?.status === 404) {
            res.status(404).json({ message: 'PR not merged.' });
        } else {
            res.status(500).json({ message: 'Error checking PR status.' });
        }
    }
};

// Utility function to parse PR URL
const parsePRUrl = (url) => {
    const regex = /https:\/\/github.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/; // https://github.com/<owner>/<repository>/pull/<number>
    const match = url.match(regex);
    if (match) {
        return {
            repoOwner: match[1],
            repoName: match[2],
            prNumber: match[3],
        };
    }
    throw new Error('Invalid PR URL.');
};

// Controller to get all contributions for a project
export const getContributionsForProject = async (req, res) => {
    const { projectId } = req.params;

    try {
        const contributions = await Contribution.find({ projectId });
        if (!contributions) return res.status(404).json({ message: 'No contributions found for this project.' });

        res.status(200).json(contributions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contributions.' });
    }
};
