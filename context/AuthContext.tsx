import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService'; // Asegúrate de importar el authService completo
import { UserCredentials, User } from '../types/AuthTypes';

type AuthContextProps = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Corregir el login
  const login = async (email: string, password: string) => {
    try {
      const credentials: UserCredentials = { email, password };
      const { token, user } = await authService.login(credentials.email, credentials.password); // Usar authService.login
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
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const user = JSON.parse(await AsyncStorage.getItem('user') || '{}');
          setUser(user);
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
        await AsyncStorage.removeItem('token'); // Limpieza en caso de error
        setUser(null);
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