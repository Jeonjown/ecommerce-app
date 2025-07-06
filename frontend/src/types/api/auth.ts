export interface SignupResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    password: string;
    created_at: Date;
  };
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
