/** Base URL for REST API – change this to your backend's address */
const API_BASE_URL = 'http://localhost:8000/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    level: string;
    avatar: string;
  };
}

/**
 * Sends login credentials to the server.
 * Returns an AuthResponse containing the JWT token and user details.
 */
export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error((error as { message?: string }).message ?? 'Login failed');
  }

  return response.json() as Promise<AuthResponse>;
};

/**
 * Registers a new user account.
 */
export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error((error as { message?: string }).message ?? 'Registration failed');
  }

  return response.json() as Promise<AuthResponse>;
};
