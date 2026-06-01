import { Router } from 'express';
import { MatchController } from '../controllers/match.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();
const matchController = new MatchController();

router.get('/', requireAuth, matchController.getMatches);

export default router;
