import express from 'express';

const router = express.Router();

// use() auth middleware

router.get(`/`, getAllProjects);

router.get(`/:project-id`, getProjectbyId);

router.post(`/new-project`, createNewProject);

// utility routes (edit, delete etc)

router.post(`/:project-id/contribute`, contribute);

export default router;

