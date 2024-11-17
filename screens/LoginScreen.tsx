import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../hooks/useAuth';

type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
};

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Por favor ingrese ambos campos.');
      return;
    }

    try {
      await login(email, password);
      navigation.replace('Dashboard'); // Redirige a la pantalla de Dashboard
    } catch (error) {
      // Asume que error.response?.data?.message tiene el mensaje del backend, o proporciona un mensaje genérico
      setErrorMessage('Credenciales incorrectas');
      setTimeout(() => setErrorMessage(''), 3000); // Limpia el mensaje de error después de 3 segundos
    }
  };

  return (
    <View style={styles.container}>
      <Input 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address"
      />
      <Input 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginScreen;
