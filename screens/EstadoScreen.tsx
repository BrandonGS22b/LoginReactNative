import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Animated } from 'react-native';
import {
  obtenerSolicitudes,
  actualizarSolicitud,
} from '../services/solicitudService';
import BottomMenu from '../components/Menu';
import { useAuth } from '../hooks/useAuth';

interface Solicitud {
  _id: string;
  categoria: string;
  descripcion: string;
  estado: string;
}

const estados = ['Revisado', 'En Proceso', 'Solucionado'];

const EstadoScreen : React.FC = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [progress, setProgress] = useState<Record<string, Animated.Value>>({});

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const data = await obtenerSolicitudes();
      setSolicitudes(data);
      initializeProgress(data);
    } catch (error) {
      console.error(error);
    }
  };

  const initializeProgress = (data: Solicitud[]) => {
    const progressValues = data.reduce((acc, solicitud) => {
      const progressValue = new Animated.Value(getProgress(solicitud.estado));
      acc[solicitud._id] = progressValue;
      return acc;
    }, {} as Record<string, Animated.Value>);
  
    // Asegúrate de que todos los valores en progress sean instancias de Animated.Value
    for (const key in progressValues) {
      if (!(progressValues[key] instanceof Animated.Value)) {
        console.error(`Valor no es una instancia de Animated.Value: ${key}`);
      }
    }
  
    setProgress(progressValues);
  };

  const getProgress = (estado: string): number => {
    return (estados.indexOf(estado) + 1) / estados.length;
  };

  const avanzarEstado = async (solicitud: Solicitud) => {
    const currentIndex = estados.indexOf(solicitud.estado);
    if (currentIndex < estados.length - 1) {
      const nuevoEstado = estados[currentIndex + 1];
      try {
        await actualizarSolicitud(solicitud._id, { estado: nuevoEstado });
        fetchSolicitudes();  // Actualizar las solicitudes después de avanzar el estado

        // Animar barra de estado
        Animated.timing(progress[solicitud._id], {
          toValue: getProgress(nuevoEstado),
          duration: 500,
          useNativeDriver: false,  // Mantener en false debido a las animaciones de propiedades no soportadas
        }).start();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const renderSolicitud = ({ item }: { item: Solicitud }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.categoria}</Text>
      <Text>{item.descripcion}</Text>
      <Text>Estado: {item.estado}</Text>
      <View style={styles.progressContainer}>
        {progress[item._id] && (
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progress[item._id]?.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        )}
      </View>
      <Text style={styles.avanzarText} onPress={() => avanzarEstado(item)}>
        Avanzar Estado
      </Text>
    </View>
  );

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={solicitudes}
        keyExtractor={(item) => item._id}
        renderItem={renderSolicitud}
      />
      {/* Menú inferior */}
      <View style={styles.menuContainer}>
        <BottomMenu
          onSolicitudPress={() => navigation.navigate('Solicitud')}
          onEstadoSolicitudPress={() => navigation.navigate('Estado')}
          onPerfilPress={() => navigation.navigate('Perfil')}
          onLogoutPress={handleLogout}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 10, 
    backgroundColor: '#f5f5f5', 
    paddingBottom: 80 // Añadir espacio al fondo para que el menú no quede tapado
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 15, 
    marginBottom: 10, 
    borderRadius: 8 
  },
  title: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  progressContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  avanzarText: {
    color: '#007bff',
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    
  }
});

export default EstadoScreen;
