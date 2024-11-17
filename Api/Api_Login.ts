import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL base de tu backend
const API_URL = 'https://loginexpress-ts-jwt.onrender.com/api/auth'; // Asegúrate de que la URL sea correcta

// Configuración de Axios con interceptor para incluir el token
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Configurar el interceptor para agregar el token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      // Convertir headers a una instancia de AxiosHeaders si no lo es
      if (!(config.headers instanceof AxiosHeaders)) {
        config.headers = new AxiosHeaders(config.headers);
      }

      // Agregar el token a los headers
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    // Manejo de errores en el interceptor
    return Promise.reject(error);
  }
);

/**
 * Función para iniciar sesión
 * @param email Email del usuario
 * @param password Contraseña del usuario
 * @returns Información del usuario con token
 */
const login = async (email: string, password: string): Promise<{ token: string; name: string; expiresIn: number }> => {
  try {
    const response = await api.post('/login', { email, password });
    const { token, name, expiresIn } = response.data;

    // Almacena los datos del usuario en AsyncStorage
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('name', name);
    await AsyncStorage.setItem('expiresIn', expiresIn.toString());

    return { token, name, expiresIn };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error en login:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido en login:', error);
    }
    throw error;
  }
};

/**
 * Función para cerrar sesión
 */
const logout = async (): Promise<void> => {
  try {
    await api.post('/logout');
    // Elimina los datos del usuario de AsyncStorage
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('name');
    await AsyncStorage.removeItem('expiresIn');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error en logout:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido en logout:', error);
    }
    throw error;
  }
};

/**
 * Función para obtener todos los usuarios
 * @returns Lista de usuarios
 */
const getUsuarios = async (): Promise<any[]> => {
  try {
    const response = await api.get('/get');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error obteniendo usuarios:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido al obtener usuarios:', error);
    }
    throw error;
  }
};

/**
 * Función para crear un usuario
 * @param userData Datos del usuario: {name, email, password, role}
 * @returns Información del usuario creado
 */
const createUsuario = async (userData: { name: string; email: string; password: string; role: string }): Promise<any> => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error creando usuario:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido al crear usuario:', error);
    }
    throw error;
  }
};

/**
 * Función para eliminar un usuario
 * @param id ID del usuario
 * @returns Resultado de la eliminación
 */
const deleteUsuario = async (id: string): Promise<any> => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error eliminando usuario:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido al eliminar usuario:', error);
    }
    throw error;
  }
};

/**
 * Función para actualizar un usuario
 * @param id ID del usuario
 * @param updatedData Datos actualizados: {name, email, role, password}
 * @returns Información del usuario actualizado
 */
const updateUsuario = async (
  id: string,
  updatedData: { name?: string; email?: string; role?: string; password?: string }
): Promise<any> => {
  try {
    const response = await api.put(`/users/${id}`, updatedData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error actualizando usuario:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido al actualizar usuario:', error);
    }
    throw error;
  }
};

/**
 * Obtener el usuario actual desde AsyncStorage
 * @returns Información del usuario actual
 */
const getCurrentUser = async (): Promise<{ name: string; token: string } | null> => {
  try {
    const name = await AsyncStorage.getItem('name');
    const token = await AsyncStorage.getItem('token');
    return name && token ? { name, token } : null;
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error);
    throw error;
  }
};

/**
 * Exportar todas las funciones como un servicio
 */
const authService = {
  login,
  logout,
  getUsuarios,
  createUsuario,
  deleteUsuario,
  updateUsuario,
  getCurrentUser,
};

export default authService;
