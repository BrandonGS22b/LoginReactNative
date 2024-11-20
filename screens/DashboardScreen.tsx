import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, TextInput } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth'; // Asegúrate de que el hook de auth esté importado correctamente
import Icon from 'react-native-vector-icons/Ionicons'; // Usamos íconos de react-native-vector-icons

// Definir los tipos de navegación
type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Solicitud: undefined;
  EstadoSolicitud: undefined;
  Perfil: undefined;
};

type Props = StackScreenProps<RootStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { logout } = useAuth(); // Trae la función de logout del hook

  const [formData, setFormData] = useState({
    categoria: '',
    descripcion: '',
    telefono: '',
    departamento: '',
    ciudad: '',
    barrio: '',
    direccion: '',
    estado: 'Revisado',
  });

  const handleLogout = async () => {
    await logout(); // Llama a logout para limpiar el estado
    navigation.replace('Login'); // Reemplaza la pantalla actual por la pantalla de Login
  };

  const handleSolicitudPress = () => {
    navigation.navigate('Solicitud'); // Navegar a la pantalla de Solicitudes
  };

  const handleEstadoSolicitudPress = () => {
    navigation.navigate('EstadoSolicitud'); // Navegar a la pantalla de Estado de Solicitud
  };

  const handlePerfilPress = () => {
    navigation.navigate('Perfil'); // Navegar a la pantalla de Perfil
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bienvenido al Dashboard</Text>

      {/* Contenido de la pantalla Dashboard */}
      <View style={styles.buttonsContainer}>
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
        {/* Aquí puedes agregar más campos según sea necesario */}
      </View>

      {/* Barra de navegación inferior con íconos */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity onPress={handleSolicitudPress} style={styles.menuButton}>
          <Icon name="list" size={30} color="#fff" />
          <Text style={styles.menuText}>Solicitudes</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleEstadoSolicitudPress} style={styles.menuButton}>
          <Icon name="information-circle" size={30} color="#fff" />
          <Text style={styles.menuText}>Estado</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePerfilPress} style={styles.menuButton}>
          <Icon name="person" size={30} color="#fff" />
          <Text style={styles.menuText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.menuButton}>
          <Icon name="log-out" size={30} color="#fff" />
          <Text style={styles.menuText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Estilos para el componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Aseguramos que la barra de menú esté al fondo
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    width: '100%',
  },
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  menuButton: {
    alignItems: 'center',
  },
  menuText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
});

export default DashboardScreen;
