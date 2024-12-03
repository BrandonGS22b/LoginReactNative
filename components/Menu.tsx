import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type BottomMenuProps = {
  onSolicitudPress: () => void;
  onEstadoSolicitudPress: () => void;
  onPerfilPress: () => void;
  onLogoutPress: () => void;
  style?: object;
};

const BottomMenu: React.FC<BottomMenuProps> = ({
  onSolicitudPress,
  onEstadoSolicitudPress,
  onPerfilPress,
  onLogoutPress,
  style,
}) => {
  return (
    <View style={[styles.bottomMenu, style]}>
      <TouchableOpacity onPress={onSolicitudPress} style={styles.menuButton}>
        <Icon name="list" size={30} color="#fff" />
        <Text style={styles.menuText}>Solicitudes</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onEstadoSolicitudPress} style={styles.menuButton}>
        <Icon name="information-circle" size={30} color="#fff" />
        <Text style={styles.menuText}>Estado</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPerfilPress} style={styles.menuButton}>
        <Icon name="person" size={30} color="#fff" />
        <Text style={styles.menuText}>Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onLogoutPress} style={styles.menuButton}>
        <Icon name="log-out" size={30} color="#fff" />
        <Text style={styles.menuText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    width: '100%',
    position: 'absolute',  // Fija el menú en la parte inferior
    bottom: 0,             // Asegura que esté en la parte inferior
    zIndex: 999,           // Asegura que el menú se quede encima de otros elementos
  },
  menuButton: {
    alignItems: 'center',
  },
  menuText: {
    color: '#fff',
    fontSize: 15,
    marginTop: 5,
  },
});

export default BottomMenu;
