import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || '');

  const handleSave = () => {
    // Aquí puedes hacer la lógica para guardar cambios en el perfil
    console.log('Guardando perfil...');
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
        editable={false}  // Suponiendo que el email no se puede cambiar
      />

      <Button title="Guardar cambios" onPress={handleSave} />
      <Button title="Cerrar sesión" onPress={logout} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ProfileScreen;
