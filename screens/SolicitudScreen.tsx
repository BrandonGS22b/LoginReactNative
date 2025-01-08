import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import BottomMenu from '../components/Menu';
import { useAuth } from '../hooks/useAuth';
import { crearSolicitud } from '../services/solicitudService';

const SolicitudScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    categoria: '',
    descripcion: '',
    telefono: '',
    departamento: 'Santander',
    ciudad: '',
    barrio: '',
    direccion: '',
    estado: 'Revisado',
  });
  const [imagen, setImagen] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        Alert.alert('Permisos requeridos', 'Se necesita acceso a la cámara para tomar fotos.');
      }
    };

    requestPermissions();
  }, []);

  const handleOpenCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

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

      await crearSolicitud(formDataWithImage);

      setFormData({
        categoria: '',
        descripcion: '',
        telefono: '',
        departamento: 'Santander',
        ciudad: '',
        barrio: '',
        direccion: '',
        estado: 'Revisado',
      });
      setImagen(null);
      Alert.alert('Éxito', 'Solicitud creada con éxito.');
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al enviar la solicitud. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
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

        <Text style={styles.label}>Ciudad</Text>
        <Picker
          selectedValue={formData.ciudad}
          onValueChange={(value) => setFormData({ ...formData, ciudad: value })}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione una ciudad" value="" />
          <Picker.Item label="Girón" value="Giron" />
          <Picker.Item label="Bucaramanga" value="Bucaramanga" />
          <Picker.Item label="Floridablanca" value="Floridablanca" />
          <Picker.Item label="Piedecuesta" value="Piedecuesta" />
        </Picker>

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

        <Button title="Abrir Cámara" onPress={handleOpenCamera} />
        {imagen && <Image source={{ uri: imagen }} style={styles.image} />}

        <View style={styles.buttonSpacing} />
        <Button title={loading ? 'Cargando...' : 'Crear Solicitud'} onPress={handleSubmit} disabled={loading} />
        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomMenu
        onSolicitudPress={() => navigation.navigate('Solicitud')}
        onEstadoSolicitudPress={() => navigation.navigate('Estado')}
        onPerfilPress={() => navigation.navigate('Perfil')}
        onLogoutPress={async () => await logout()}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 120, // Espacio adicional para evitar que el menú tape el contenido
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
  buttonSpacing: {
    marginVertical: 16,
  },
});

export default SolicitudScreen;
