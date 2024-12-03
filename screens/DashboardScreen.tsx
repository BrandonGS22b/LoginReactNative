import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';
import BottomMenu from '../components/Menu';

type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Solicitud: undefined;
  EstadoSolicitud: undefined;
  Perfil: undefined;
};

type Props = StackScreenProps<RootStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { logout } = useAuth();

  const [formData, setFormData] = useState({
    categoria: '',
    descripcion: '',
  });

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bienvenido al Dashboard</Text>

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
      </View>

      {/* Menú inferior */}
      <BottomMenu
        onSolicitudPress={() => navigation.navigate('Solicitud')}
        onEstadoSolicitudPress={() => navigation.navigate('EstadoSolicitud')}
        onPerfilPress={() => navigation.navigate('Perfil')}
        onLogoutPress={handleLogout}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
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
});

export default DashboardScreen;
