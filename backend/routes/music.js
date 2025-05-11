import express from 'express';
import { showForm, handleRecommendation } from '../controllers/music.js';

const router = express.Router();

router.get('/', showForm);
router.post('/recommend', handleRecommendation);

export default router;
