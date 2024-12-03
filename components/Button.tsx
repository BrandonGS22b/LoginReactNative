import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;  // Permite pasar un estilo personalizado
}

const Button: React.FC<ButtonProps> = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,  // Separa un poco más los bordes
    paddingHorizontal: 20,  // Hace el botón más ancho
    borderRadius: 10,  // Bordes más redondeados
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,  // Sombra para Android
    shadowColor: '#000',  // Sombra para iOS
    shadowOffset: { width: 0, height: 4 },  // Sombra sutil hacia abajo
    shadowOpacity: 0.3,  // Opacidad de la sombra
    shadowRadius: 5,  // Radio de la sombra
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,  // Fuente un poco más grande para más visibilidad
    textAlign: 'center',
  },
});

export default Button;
