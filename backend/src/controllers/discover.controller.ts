import { Request, Response } from 'express';
import { DiscoverService } from '../services/discover.service';

export class DiscoverController {
  private discoverService = new DiscoverService();

  getFeed = async (req: Request, res: Response): Promise<void> => {
    try {
      const currentUserId = req.user!.id; 
      
      const profiles = await this.discoverService.getFeed(currentUserId);
      res.status(200).json(profiles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}