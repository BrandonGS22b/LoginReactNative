import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../hooks/useAuth';

const DashboardScreen: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <View>
      <Text>Bienvenido, {user?.name}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default DashboardScreen;
