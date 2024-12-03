import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import BottomMenu from '../components/Menu'; // Importa el menú inferior

const ProfileScreen: React.FC = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || '');

  const handleSave = () => {
    console.log('Guardando perfil...');
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>
      
      <Input 
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      
      <Input 
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={false} // Email no editable
      />

      <Button title="Guardar cambios" onPress={handleSave} />
      <Button title="Cerrar sesión" onPress={handleLogout} color="red" />

      {/* Menú inferior */}
      <View style={styles.menuContainer}>
        <BottomMenu
          onSolicitudPress={() => navigation.navigate('Solicitud')}
          onEstadoSolicitudPress={() => navigation.navigate('Estado')}
          onPerfilPress={() => navigation.navigate('Perfil')}
          onLogoutPress={handleLogout}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    
  }
});

export default ProfileScreen;
