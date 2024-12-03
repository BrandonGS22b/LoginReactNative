import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';
import { UserCredentials, User } from '../types/AuthTypes';

type AuthContextProps = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  loading: boolean; // Agregar estado de carga
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Estado de carga

  const login = async (email: string, password: string) => {
    setLoading(true); // Iniciar carga
    try {
      const credentials: UserCredentials = { email, password };
      const { token, user } = await authService.login(credentials.email, credentials.password);

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setUser(user);
      setError(null);  // Limpiar el error si el login es exitoso
    } catch (error) {
      console.error('Error en el login:', error instanceof Error ? error.message : error);
      setError('Error al iniciar sesión. Por favor, intente nuevamente.');
    } finally {
      setLoading(false); // Detener carga
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true); // Iniciar carga
      try {
        const token = await AsyncStorage.getItem('token');
        const userString = await AsyncStorage.getItem('user');

        if (token && userString) {
          const user: User = JSON.parse(userString);
          setUser(user);
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false); // Detener carga
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
