import { Router } from 'express';
import { InteractionController } from '../controllers/interaction.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();
const interactionController = new InteractionController();

router.post('/swipe', requireAuth, interactionController.swipe);

export default router;