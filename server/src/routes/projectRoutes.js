import express from 'express';
import { getAllProjects, getProjectById, createNewProject, contribute, approveContribution } from '../controllers/projectController.js';

const router = express.Router();

// use() auth middleware

router.get(`/`, getAllProjects);
router.get(`/:projectId`, getProjectById);
router.post(`/new-project`, createNewProject);

// utility routes (edit, delete etc)
router.post(`/:projectId/contribute`, contribute);

export default router;
