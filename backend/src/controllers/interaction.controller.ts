import { Request, Response } from 'express';
import { InteractionService } from '../services/interaction.service';

export class InteractionController {
  private interactionService = new InteractionService();

  swipe = async (req: Request, res: Response): Promise<void> => {
    try {
      const currentUserId = req.user!.id; 
      const { targetUserId, isLike } = req.body;

      if (currentUserId === targetUserId) {
        res.status(400).json({ error: "You cannot swipe on yourself." });
        return;
      }

      const result = await this.interactionService.processSwipe(currentUserId, targetUserId, isLike);
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}