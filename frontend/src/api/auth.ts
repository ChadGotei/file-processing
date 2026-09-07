import { api } from "./http";

export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

type AuthResponse = { message: string; data: User };
type CurrentUserResponse = { message: string; user: User };

export type LoginCredentials = { email: string; password: string };
export type RegisterCredentials = LoginCredentials & { name: string; confirmPassword: string };

export async function getCurrentUser() {
  const response = await api.get<CurrentUserResponse>("/auth/me");
  return response.data.user;
}

export async function login(credentials: LoginCredentials) {
  const response = await api.post<AuthResponse>("/auth/login", credentials);
  return response.data.data;
}

export async function register(credentials: RegisterCredentials) {
  const response = await api.post<AuthResponse>("/auth/register", credentials);
  return response.data.data;
}

export async function logout() {
  await api.post("/auth/logout");
}
