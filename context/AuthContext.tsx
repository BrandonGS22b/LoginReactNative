import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginService } from '../services/authService';
import { UserCredentials, User } from '../types/AuthTypes';

type AuthContextProps = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Define el tipo para las props del AuthProvider, incluyendo children
type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const credentials: UserCredentials = { email, password };
      const { token, user } = await loginService(credentials);
      await AsyncStorage.setItem('token', token);
      setUser(user);
    } catch (error) {
console.error('Error en el login:', (error as Error).message);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('token');
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Aquí podrías validar el token o obtener los datos del usuario
      }
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
