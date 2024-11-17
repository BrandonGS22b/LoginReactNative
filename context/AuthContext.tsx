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

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const credentials: UserCredentials = { email, password };
      const { token, user } = await authService.login(credentials.email, credentials.password);

      // Store token and user in AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));  // Guarda el objeto 'user' en AsyncStorage

      // Update user state
      setUser(user);
    } catch (error) {
      console.error('Error en el login:', error instanceof Error ? error.message : error);
    }
  };

  // Logout function
  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setUser(null); // Clear the user state
  };

  // Load user from AsyncStorage on app startup
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userString = await AsyncStorage.getItem('user');
        
        if (token && userString) {
          const user: User = JSON.parse(userString);
          setUser(user);  // Set the user from AsyncStorage
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
        await AsyncStorage.removeItem('token'); // Cleanup in case of error
        await AsyncStorage.removeItem('user'); // Remove user data on error
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
