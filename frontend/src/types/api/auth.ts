export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: Date;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: AuthenticatedUser;
}
