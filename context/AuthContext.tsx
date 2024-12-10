import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';
import { UserCredentials, User } from '../types/AuthTypes';

type AuthContextProps = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  loading: boolean;
  userId: string | null; // ID del usuario para crear solicitudes
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // Estado para guardar el ID del usuario
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const credentials: UserCredentials = { email, password };
      const { token, user } = await authService.login(credentials.email, credentials.password);

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setUser(user);
      setUserId(user._id); // Guardar el ID del usuario
      setError(null);
    } catch (error) {
      console.error('Error en el login:', error instanceof Error ? error.message : error);
      setError('Error al iniciar sesión. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setUser(null);
    setUserId(null);
    setError(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        const userString = await AsyncStorage.getItem('user');

        if (token && userString) {
          const user: User = JSON.parse(userString);
          setUser(user);
          setUserId(user._id); // Cargar el ID del usuario
        } else {
          // Si no hay token o usuario, cerrar sesión
          await logout();
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
        await logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userId, login, logout, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
