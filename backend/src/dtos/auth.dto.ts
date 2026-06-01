export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  gender: string;
  interestedIn: string;
}

export interface LoginDto {
  email: string;
  password: string;
}