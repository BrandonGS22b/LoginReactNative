import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import SplashScreen from './../context/SplashScreen';
import LoginScreen from './../screens/LoginScreen';
import DashboardScreen from './../screens/DashboardScreen';
import SolicitudScreen from './../screens/SolicitudScreen';
import ProfileScreen from './../screens/ProfileScreen';
import EstadoScreen from './../screens/EstadoScreen';
import ChangePasswordScreen from './../screens/changepassword'; // Asegúrate de importar la pantalla de cambio de contraseña

// Definir el tipo de las rutas
type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Dashboard: undefined;
  Solicitud: undefined;
  Perfil: undefined;
  Estado: undefined;
  ChangePassword: undefined; // Agregar la ruta ChangePassword
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user } = useAuth(); // Obtener el estado de autenticación

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Registra la pantalla Splash como la pantalla inicial */}
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />

        {/* Si el usuario está autenticado, mostramos el Dashboard, si no, mostramos el Login */}
        {user ? (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Solicitud" component={SolicitudScreen} />
            <Stack.Screen name="Perfil" component={ProfileScreen} />
            <Stack.Screen name="Estado" component={EstadoScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}

        {/* Ruta de la pantalla ChangePassword */}
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
