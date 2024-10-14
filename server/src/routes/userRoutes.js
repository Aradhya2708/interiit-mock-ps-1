import express from 'express';
// import controllers

const router = express.Router();

router.get(`/me`, getCurrentUser);

router.get(`/:username`, getUserbyUsername);

export default router;