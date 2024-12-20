import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import BottomMenu from '../components/Menu';
import { useAuth } from '../hooks/useAuth';
import { crearSolicitud, obtenerSolicitudes } from '../services/solicitudService';

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
  const [error, setError] = useState<string | null>(null);

  const fetchSolicitudes = async () => {
    try {
      const response = await obtenerSolicitudes();
      setSolicitudes(response.data);
    } catch (error) {
      console.error('Error al obtener las solicitudes:', error);
      setError('No se pudo cargar las solicitudes.');
    }
  };

  useEffect(() => {
    const requestPermissions = async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        Alert.alert('Permisos requeridos', 'Se necesita acceso a la cámara para tomar fotos.');
      }
    };

    requestPermissions();
    fetchSolicitudes();
  }, []);

  const handleOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos denegados', 'Se necesita acceso a la cámara para tomar fotos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
  
    if (Object.values(formData).some((value) => !value)) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos antes de enviar.');
      setLoading(false);
      return;
    }
  
    try {
      const formDataWithImage = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataWithImage.append(key, value as string);
      });
  
      if (user?._id) {
        formDataWithImage.append('usuario_id', user._id);
      } else {
        Alert.alert('Error', 'Usuario no identificado.');
        setLoading(false);
        return;
      }
  
      if (imagen) {
        const uriParts = imagen.split('.');
        const fileType = uriParts[uriParts.length - 1];
        const response = await fetch(imagen);
        const blob = await response.blob();
        formDataWithImage.append('imagen', {
          uri: imagen,
          type: `image/${fileType}`,
          name: `imagen.${fileType}`,
        } as any);
      }
  
      console.log('Datos enviados:', formDataWithImage);
  
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
      Alert.alert('Éxito', 'Solicitud creada con éxito.');
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      Alert.alert('Error', 'Ocurrió un error al enviar la solicitud. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Gestión de Solicitudes</Text>

        <Text style={styles.label}>Categoría</Text>
        <Picker
          selectedValue={formData.categoria}
          onValueChange={(value) => setFormData({ ...formData, categoria: value })}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione una categoría" value="" />
          <Picker.Item label="Mantenimiento" value="Mantenimiento" />
          <Picker.Item label="Reparación" value="Reparación" />
          <Picker.Item label="Denuncia" value="Denuncia" />
        </Picker>

        {['descripcion', 'telefono', 'departamento', 'ciudad', 'barrio', 'direccion'].map((field, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={(formData as any)[field]}
            onChangeText={(text) => setFormData({ ...formData, [field]: text })}
          />
        ))}

        <Button title="Abrir Cámara" onPress={handleOpenCamera} />
        {imagen && <Image source={{ uri: imagen }} style={styles.image} />}

        <Button title={loading ? 'Cargando...' : 'Crear Solicitud'} onPress={handleSubmit} disabled={loading} />

        {error && <Text style={styles.errorText}>{error}</Text>}

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
      </View>

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
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    padding: 16,
    marginBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginBottom: 12,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 12,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  solicitudItem: {
    marginBottom: 16,
  },
  solicitudImage: {
    width: 100,
    height: 100,
    marginTop: 8,
  },
});

export default SolicitudScreen;
