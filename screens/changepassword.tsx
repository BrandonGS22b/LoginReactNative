import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importa la biblioteca de íconos
import Button from '../components/Button';
import Input from '../components/Input';
import authService from '../services/authService';

type RootStackParamList = {
  Login: undefined;
  Estado: undefined;
  ChangePassword: undefined;
};

type ChangePasswordScreenProps = NativeStackScreenProps<RootStackParamList, 'ChangePassword'>;

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [document, setDocument] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!email || !document || !newPassword) {
      setErrorMessage('Por favor complete todos los campos.');
      return;
    }
  
    try {
      setLoading(true);
      const response = await authService.changePassword(email, document, newPassword);
      alert(response.message || 'Contraseña cambiada con éxito.');
      navigation.navigate('Login');
    } catch (error) {
      setErrorMessage('Hubo un error al cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Cambiar contraseña</Text>

      <View style={styles.inputContainer}>
        <Icon name="email" size={20} color="#7f8c8d" style={styles.icon} />
        <Input
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="credit-card" size={20} color="#7f8c8d" style={styles.icon} />
        <Input
          placeholder="Documento"
          value={document}
          onChangeText={setDocument}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#7f8c8d" style={styles.icon} />
        <Input
          placeholder="Nueva contraseña"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
      ) : (
        <Button title="Cambiar contraseña" onPress={handleChangePassword} style={styles.button} />
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backToLogin}>Volver al inicio de sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#34495e',
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#3498db',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToLogin: {
    marginTop: 15,
    fontSize: 14,
    color: '#2980b9',
    textDecorationLine: 'underline',
  },
  loader: {
    marginTop: 20,
  },
});

export default ChangePasswordScreen;
