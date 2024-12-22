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


export const obtenerSolicitudesPorUsuarioId = async (id: string) => {
  if (!id) {
    throw new Error('El ID de la solicitud es obligatorio.');
  }

  try {
    const response = await axios.get(`${API_URL}/getall/${id}`);
    return response.data;
  } catch (error: any) {
    // Manejo de errores detallado
    if (error.response) {
      // Error con la respuesta del servidor
      console.error('Error en la respuesta del servidor:', error.response.data);
      throw new Error(error.response?.data.message || 'Error en la solicitud.');
    } else if (error.request) {
      // El servidor no respondió
      console.error('No se recibió respuesta del servidor:', error.request);
      throw new Error('No se recibió respuesta del servidor');
    } else {
      // Error general
      console.error('Error al realizar la solicitud:', error.message);
      throw new Error('Error en la solicitud');
    }
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
