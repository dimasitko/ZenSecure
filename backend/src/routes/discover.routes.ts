import { Router } from 'express';
import { DiscoverController } from '../controllers/discover.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();
const discoverController = new DiscoverController();

router.get('/feed', requireAuth, discoverController.getFeed);

export default router;