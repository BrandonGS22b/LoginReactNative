import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  crearSolicitud,
  obtenerSolicitudes,
  actualizarSolicitud,
  eliminarSolicitud,
} from '../services/solicitudService';

// Define interfaces para los tipos de datos
interface FormData {
  categoria: string;
  descripcion: string;
  telefono: string;
  departamento: string;
  ciudad: string;
  barrio: string;
  direccion: string;
  estado: string;
}

interface Solicitud {
  _id: string;
  categoria: string;
  descripcion: string;
  imagen?: string;
  estado: string;
}

const SolicitudScreen = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);  // Tipo para solicitudes
  const [formData, setFormData] = useState<FormData>({
    categoria: '',
    descripcion: '',
    telefono: '',
    departamento: '',
    ciudad: '',
    barrio: '',
    direccion: '',
    estado: 'Revisado',
  });  // Tipo para formData
  const [imagen, setImagen] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  // Efecto para cargar solicitudes al iniciar
  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const data = await obtenerSolicitudes();
      setSolicitudes(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Manejo de selección de imagen
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImagen(result.assets[0].uri);
    }
  };

  // Manejo del formulario para crear o actualizar una solicitud
  const handleSubmit = async () => {
    const solicitudForm = new FormData();
    Object.entries(formData).forEach(([key, value]) => solicitudForm.append(key, value));
    if (imagen) {
      const filename = imagen.split('/').pop()!;
      const type = `image/${filename.split('.').pop()}`;
      solicitudForm.append('imagen', { uri: imagen, name: filename, type } as any);
    }

    try {
      if (editId) {
        await actualizarSolicitud(editId, solicitudForm);
        setEditId(null);
      } else {
        await crearSolicitud(solicitudForm);
      }
      fetchSolicitudes();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  // Resetear el formulario
  const resetForm = () => {
    setFormData({
      categoria: '',
      descripcion: '',
      telefono: '',
      departamento: '',
      ciudad: '',
      barrio: '',
      direccion: '',
      estado: 'Revisado',
    });
    setImagen(null);
  };

  // Manejo de eliminación de solicitud
  const handleDelete = async (id: string) => {
    try {
      await eliminarSolicitud(id);
      fetchSolicitudes();
    } catch (error) {
      console.error(error);
    }
  };

  // Manejo de edición de solicitud
const handleEdit = (solicitud: Solicitud) => {
  // Asegúrate de incluir las propiedades faltantes al asignar el formulario
  setFormData({
    categoria: solicitud.categoria,
    descripcion: solicitud.descripcion,
    telefono: '',  // O el valor correspondiente si está presente en la solicitud
    departamento: '',  // O el valor correspondiente si está presente en la solicitud
    ciudad: '',  // O el valor correspondiente si está presente en la solicitud
    barrio: '',  // O el valor correspondiente si está presente en la solicitud
    direccion: '',  // O el valor correspondiente si está presente en la solicitud
    estado: solicitud.estado,
  });
  setImagen(solicitud.imagen || null);
  setEditId(solicitud._id);
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Solicitudes</Text>
      <TextInput
        style={styles.input}
        placeholder="Categoría"
        value={formData.categoria}
        onChangeText={(text) => setFormData({ ...formData, categoria: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={formData.descripcion}
        onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
      />
      <Button title="Seleccionar Imagen" onPress={handleImagePick} />
      {imagen && <Image source={{ uri: imagen }} style={styles.image} />}
      <Button
        title={editId ? 'Actualizar Solicitud' : 'Crear Solicitud'}
        onPress={handleSubmit}
      />
      <FlatList
        data={solicitudes}
        keyExtractor={(item) => item._id || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.categoria}</Text>
            <Text>{item.descripcion}</Text>
            {item.imagen && <Image source={{ uri: item.imagen }} style={styles.image} />}
            <View style={styles.actions}>
              <Button title="Editar" onPress={() => handleEdit(item)} />
              <Button title="Eliminar" onPress={() => handleDelete(item._id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, padding: 8, marginBottom: 10 },
  card: { padding: 10, borderWidth: 1, marginBottom: 10 },
  image: { width: 100, height: 100, marginBottom: 10 },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
});

export default SolicitudScreen;
