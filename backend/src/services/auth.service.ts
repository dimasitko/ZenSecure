import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';

export class AuthService {
  private userRepository = new UserRepository();
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

 async register(dto: RegisterDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('Email is already in use');
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);
    
    // Використовуємо нові поля замість 'name'
    const user = await this.userRepository.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      gender: dto.gender,
      targetGender: dto.targetGender,
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      message: 'Account created. Pending administrator approval.'
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

   // if (!user.isApproved && user.role !== 'admin') {
    //  throw new Error('Access Denied: Account is pending manual administrator confirmation.');
    //}

    const token = jwt.sign(
      { id: user.id, role: user.role },
      this.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName ,
        email: user.email,
        photoUrl: user.photoUrl
      }
    };
  }
}