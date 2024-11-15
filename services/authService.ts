import api from '../Api/Api';
import { UserCredentials, AuthResponse } from '../types/AuthTypes';

export const login = async (credentials: UserCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/login', credentials);
  return response.data;
};
