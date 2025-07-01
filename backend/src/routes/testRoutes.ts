import express from 'express';
import { printTest, testDbConnection } from '../controllers/testControllers';

const router = express.Router();

router.get('/', printTest);
router.get('/dbtest', testDbConnection);

export default router;
