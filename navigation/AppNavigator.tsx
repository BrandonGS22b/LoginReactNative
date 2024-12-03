import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SolicitudScreen from '../screens/SolicitudScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EstadoScreen from '../screens/EstadoScreen';

// Define el tipo de las rutas
type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Solicitud: undefined;
  Perfil: undefined;
  Estado: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Si el usuario está autenticado, muestra el Dashboard, sino, muestra el Login */}
        {user ? (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Solicitud" component={SolicitudScreen} />
            <Stack.Screen name="Perfil" component={ProfileScreen} />
            <Stack.Screen name="Estado" component={EstadoScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
