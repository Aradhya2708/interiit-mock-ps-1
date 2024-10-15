// Manages actions related to creating and managing projects.

import Project from '../models/projectModel.js'; // Adjust the path based on your structure
import User from '../models/userModel.js'; // Adjust the path based on your structure
import Contribution from '../models/contributionModel.js'

// Get all projects
export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('createdBy collaborators');
        res.status(200).json(projects); // Return the list of projects
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get a project by ID
export const getProjectById = async (req, res) => {
    const { projectId } = req.params; // Extract project ID from the request parameters

    try {
        const project = await Project.findById(projectId).populate('createdBy collaborators');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(project); // Return the project details
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Create a new project
export const createNewProject = async (req, res) => {
    const { title, description, repositoryUrl, paymentAmount } = req.body; // Extract data from the request body
    const userId = req.session.userId; // Get the user ID from the session

    try {
        const newProject = new Project({
            title,
            description,
            createdBy: userId, // Set the creator of the project
            collaborators: [], // Initialize collaborators as an empty array
            repositoryUrl,
            paymentAmount,
        });

        await newProject.save(); // Save the new project to the database
        res.status(201).json(newProject); // Return the created project
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Function to handle contribution request
export const contribute = async (req, res) => {
    const { projectId } = req.params;
    const freelancerId = req.session.userId; // Assuming the user is authenticated

    try {
        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Create a new contribution record
        const contribution = new Contribution({
            projectId: projectId,
            freelancerId: freelancerId,
            status: 'pending',
        });

        await contribution.save();

        // Notify employer (could be an email or in-app notification)
        // We'll assume the project owner is the employer
        const employer = await User.findById(project.createdBy);
        // Add notification logic here

        res.status(200).json({ message: 'Contribution request sent to employer' });
    } catch (error) {
        console.error('Error contributing to project:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
