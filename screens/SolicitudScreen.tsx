import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image, ScrollView } from 'react-native';
import { crearSolicitud, obtenerSolicitudes } from '../services/solicitudService';
import * as ImagePicker from 'expo-image-picker';
import BottomMenu from '../components/Menu';
import { useAuth } from '../hooks/useAuth';

interface FormData {
  categoria: string;
  descripcion: string;
  telefono: string;
  departamento: string;
  ciudad: string;
  barrio: string;
  direccion: string;
  estado: 'Revisado' | 'En proceso' | 'Solucionado';
}

const SolicitudScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [formData, setFormData] = useState<FormData>({
    categoria: '',
    descripcion: '',
    telefono: '',
    departamento: '',
    ciudad: '',
    barrio: '',
    direccion: '',
    estado: 'Revisado',
  });
  const [imagen, setImagen] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Función para cargar las solicitudes
  const fetchSolicitudes = async () => {
    try {
      const response = await obtenerSolicitudes();
      setSolicitudes(response.data);
    } catch (error) {
      console.error('Error al obtener las solicitudes:', error);
    }
  };

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permiso para acceder a la galería es necesario!');
      }
    };
    requestPermissions();
    fetchSolicitudes();
  }, []);

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImagen(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Crear un FormData
    const formDataWithImage = new globalThis.FormData();

    // Agregar los campos al FormData
    Object.entries(formData).forEach(([key, value]) => {
      formDataWithImage.append(key, value as string);
    });

    // Agregar la imagen si existe
    if (imagen) {
      const uriParts = imagen.split('.');
      const fileType = uriParts[uriParts.length - 1];
      try {
        const response = await fetch(imagen);
        const blob = await response.blob();
        formDataWithImage.append('imagen', blob, `imagen.${fileType}`);
      } catch (error) {
        console.error('Error al obtener la imagen:', error);
      }
    }

    try {
      // Crear solicitud
      await crearSolicitud(formDataWithImage);
      fetchSolicitudes();
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
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <ScrollView style={styles.container}>
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
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={formData.telefono}
          onChangeText={(text) => setFormData({ ...formData, telefono: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Departamento"
          value={formData.departamento}
          onChangeText={(text) => setFormData({ ...formData, departamento: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Ciudad"
          value={formData.ciudad}
          onChangeText={(text) => setFormData({ ...formData, ciudad: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Barrio"
          value={formData.barrio}
          onChangeText={(text) => setFormData({ ...formData, barrio: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Dirección"
          value={formData.direccion}
          onChangeText={(text) => setFormData({ ...formData, direccion: text })}
        />

        <Button title="Seleccionar Imagen" onPress={handleImagePicker} />
        {imagen && <Image source={{ uri: imagen }} style={styles.image} />}

        <Button title={loading ? 'Cargando...' : 'Crear Solicitud'} onPress={handleSubmit} disabled={loading} />

        <FlatList
          data={solicitudes}
          renderItem={({ item }) => (
            <View style={styles.solicitudItem}>
              <Text>{item.descripcion}</Text>
              {item.imagen && <Image source={{ uri: item.imagen }} style={styles.solicitudImage} />}
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      </ScrollView>

      {/* Menú inferior */}
      <BottomMenu
        onSolicitudPress={() => navigation.navigate('Solicitud')}
        onEstadoSolicitudPress={() => navigation.navigate('Estado')}
        onPerfilPress={() => navigation.navigate('Perfil')}
        onLogoutPress={handleLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'space-between', // Espacio entre el contenido y el menú
  },
  container: {
    flex: 1,
    padding: 16,
    marginBottom: 60, // Espacio para evitar que el menú se superponga
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  solicitudItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  solicitudImage: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
});

export default SolicitudScreen;
