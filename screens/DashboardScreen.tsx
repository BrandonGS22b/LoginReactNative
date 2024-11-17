import React from 'react';
import { View, Text, Button } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth'; // Asegúrate de que el hook de auth esté importado correctamente

type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
};

type Props = StackScreenProps<RootStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { logout } = useAuth(); // Trae la función de logout del hook

  const handleLogout = async () => {
    await logout(); // Llama a logout para limpiar el estado
    navigation.replace('Login'); // Reemplaza la pantalla actual por la pantalla de Login
  };

  return (
    <View>
      <Text>Dashboard Screen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default DashboardScreen;
