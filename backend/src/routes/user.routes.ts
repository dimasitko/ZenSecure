import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middlewares/auth.middleware';

export const userRouter = Router();

userRouter.get('/profile', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        age: true,
        gender: true,
        targetGender: true,
        agePreference: true,
        country: true,
        city: true,
        phone: true,
        photoUrl: true,
        email: true,
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

userRouter.put('/profile', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { firstName, lastName, age, gender, targetGender, agePreference, country, city, phone, photoUrl } = req.body;
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { 
        firstName, 
        lastName, 
        age: age ? parseInt(age) : null, 
        gender, 
        targetGender, 
        agePreference, 
        country,
        city, 
        phone,
        photoUrl
      },
    });
    
    res.json({ message: 'Profile updated!', user });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});