import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Animated, TextInput, Button } from 'react-native';
import { obtenerSolicitudesPorUsuarioId, actualizarSolicitud } from '../services/solicitudService';
import BottomMenu from '../components/Menu';
import { useAuth } from '../hooks/useAuth';

interface Solicitud {
  _id: string;
  categoria: string;
  descripcion: string;
  estado: string;
  barrio: string; // Campo adicional para el barrio
  ciudad: string; // Campo adicional para el nombre
}

const estados = ['Revisado', 'En proceso', 'Solucionado'];

const EstadoScreen: React.FC = ({ navigation }: any) => {
  const { userId, logout } = useAuth(); // Obtenemos el userId desde el contexto
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [progress, setProgress] = useState<Record<string, Animated.Value>>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (userId) {
      fetchSolicitudes(userId);
    }
  }, [userId]);

  const fetchSolicitudes = async (userId: string) => {
    try {
      const data = await obtenerSolicitudesPorUsuarioId(userId);
      setSolicitudes(data);
      initializeProgress(data);
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
    }
  };

  const initializeProgress = (data: Solicitud[]) => {
    const progressValues = data.reduce((acc, solicitud) => {
      acc[solicitud._id] = new Animated.Value(getProgress(solicitud.estado));
      return acc;
    }, {} as Record<string, Animated.Value>);
    setProgress(progressValues);
  };

  const getProgress = (estado: string): number => {
    switch (estado) {
      case 'Revisado':
        return 0.25;
      case 'En proceso':
        return 0.6;
      case 'Solucionado':
        return 1;
      default:
        return 0;
    }
  };

  const avanzarEstado = async (solicitud: Solicitud) => {
    const currentIndex = estados.indexOf(solicitud.estado);
    if (currentIndex < estados.length - 1) {
      const nuevoEstado = estados[currentIndex + 1];
      try {
        await actualizarSolicitud(solicitud._id, { estado: nuevoEstado });
        setSolicitudes((prevState) =>
          prevState.map((s) => (s._id === solicitud._id ? { ...s, estado: nuevoEstado } : s))
        );
        Animated.timing(progress[solicitud._id], {
          toValue: getProgress(nuevoEstado),
          duration: 500,
          useNativeDriver: false,
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
      <Text>Barrio: {item.barrio}</Text>
      <Text>Ciudad: {item.ciudad}</Text>
      <View style={styles.progressContainer}>
        {progress[item._id] && (
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progress[item._id].interpolate({
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

  const filteredSolicitudes = solicitudes.filter(
    (solicitud) =>
      solicitud._id.includes(searchQuery) ||
      solicitud.categoria.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solicitud.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solicitud.barrio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solicitud.ciudad.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar por ID, categoría, descripción, barrio o ciudad"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredSolicitudes}
        keyExtractor={(item) => item._id}
        renderItem={renderSolicitud}
      />
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
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
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
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default EstadoScreen;
