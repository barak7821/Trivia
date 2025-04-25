import Express from 'express';
import { getQuiz, createQuiz, createAttempt, updateAttempt, getScores, checkQuizId } from '../controllers/quizController.js';

// Define the router
const router = Express.Router()

// Define the routes
router.get('/:id', getQuiz)
router.post('/', createQuiz)
router.post('/user', createAttempt)
router.put('/:id', updateAttempt)
router.get('/user/:id', getScores)
router.post('/check', checkQuizId)

export default router