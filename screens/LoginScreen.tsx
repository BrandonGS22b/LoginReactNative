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
      setErrorMessage('Credenciales incorrectas');
      setTimeout(() => setErrorMessage(''), 3000); // Limpia el mensaje de error después de 3 segundos
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      
      <Input 
        placeholder="Correo electrónico" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
        style={styles.input}
      />
      
      <Input 
        placeholder="Contraseña" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={styles.input}
      />
      
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      
      <Button title="Iniciar sesión" onPress={handleLogin} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2', // Fondo suave para un aspecto más limpio
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 15,
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#3498db', // Color de botón atractivo
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoginScreen;
