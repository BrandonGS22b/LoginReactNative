import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';

type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Dashboard: undefined;
};

type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Si no está cargando, redirige según el estado del usuario
      if (user) {
        navigation.replace('Dashboard'); // Usuario autenticado
      } else {
        navigation.replace('Login'); // Usuario no autenticado
      }
    }
  }, [loading, user, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3498db" />
      <Text style={styles.text}>Cargando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  text: {
    fontSize: 18,
    marginTop: 20,
    color: '#555',
  },
});

export default SplashScreen;
