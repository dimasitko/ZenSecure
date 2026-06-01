import { Request, Response } from 'express';
import { MatchService } from '../services/match.service';

export class MatchController {
  private matchService = new MatchService();

  getMatches = async (req: Request, res: Response): Promise<void> => {
    try {
      const currentUserId = req.user!.id;
      const matches = await this.matchService.getUserMatches(currentUserId);
      res.status(200).json(matches);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}