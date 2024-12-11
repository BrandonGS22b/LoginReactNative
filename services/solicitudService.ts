import axios from 'axios';

const API_URL = 'https://loginexpress-ts-jwt.onrender.com/api/solicitud'; // Cambia por la URL de tu backend

export const crearSolicitud = async (solicitudData: FormData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, solicitudData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error al crear la solicitud:', error);
    throw error.response?.data || 'Error en la solicitud.';
  }
};

export const obtenerSolicitudes = async () => {
  try {
    const response = await axios.get(`${API_URL}/getall`);
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener las solicitudes:', error);
    throw error.response?.data || 'Error en la solicitud.';
  }
};

export const actualizarSolicitud = async (id: string, solicitudData: { estado: string }) => {
  try {
    const response = await axios.put(`${API_URL}/solicitudes/update/${id}`, solicitudData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error al actualizar la solicitud:', error);
    throw error.response?.data || 'Error en la solicitud.';
  }
};


export const eliminarSolicitud = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/solicitudes/delete/${id}`);
    return { message: 'Solicitud eliminada exitosamente' };
  } catch (error: any) {
    console.error('Error al eliminar la solicitud:', error);
    throw error.response?.data || 'Error en la solicitud.';
  }
};
