export type UserRole = 'USER' | 'ADMIN' | 'OWNER';

export interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AuthActions {
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}