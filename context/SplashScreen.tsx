import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Definir el tipo de las rutas que el navegador manejará
type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Dashboard: undefined;
};

// Definir las propiedades del componente SplashScreen
type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');  // Redirige a la pantalla Login después de un tiempo
    }, 2000);  // Cambia este tiempo según lo necesites

    return () => clearTimeout(timer); // Limpiar el timeout cuando el componente se desmonte
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Cargando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});

export default SplashScreen;
