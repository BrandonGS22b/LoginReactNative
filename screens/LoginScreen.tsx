import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../hooks/useAuth';

type RootStackParamList = {
  Login: undefined;
  Estado: undefined;
};

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, userId, loading } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Por favor ingrese ambos campos.');
      return;
    }

    try {
      await login(email, password);
      if (userId) {
        setModalVisible(true); // Muestra el mensaje de bienvenida
      }
    } catch (error) {
      setErrorMessage('Credenciales incorrectas');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleModalClose = () => {
    console.log('Navegando a Estado...');
    setModalVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Estado' }],
    });
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

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
      ) : (
        <Button title="Iniciar sesión" onPress={handleLogin} style={styles.button} />
      )}

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              ¡Bienvenido, {user?.name || 'Usuario'}!
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
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
    backgroundColor: '#3498db',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default LoginScreen;