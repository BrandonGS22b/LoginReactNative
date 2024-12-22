import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Animated, TextInput, Button } from 'react-native';
import { obtenerSolicitudes, obtenerSolicitudesPorUsuarioId, actualizarSolicitud } from '../services/solicitudService';
import BottomMenu from '../components/Menu';
import { useAuth } from '../hooks/useAuth';

interface Solicitud {
  _id: string;
  categoria: string;
  descripcion: string;
  estado: string;
}

const estados = ['Revisado', 'En proceso', 'Solucionado'];

const EstadoScreen: React.FC = ({ navigation }: any) => {
  const { userId, logout } = useAuth();  // Obtenemos el userId desde el contexto
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [progress, setProgress] = useState<Record<string, Animated.Value>>({});
  const [solicitudId, setSolicitudId] = useState('');
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<Solicitud | null>(null);

  useEffect(() => {
    if (userId) {
      console.log('User ID:', userId);  // Imprime el userId
      fetchSolicitudes(userId);  // Llamamos a fetchSolicitudes pasando userId
    }
  }, [userId]);  // Dependemos de userId para que se actualice cuando cambie

  const fetchSolicitudes = async (userId: string) => {
    if (!userId) {
      console.error("No se encontró el usuario autenticado.");
      return;
    }

    console.log('User ID en fetchSolicitudes:', userId);  // Imprime el userId
    try {
      // Usamos userId para obtener las solicitudes
      const data = await obtenerSolicitudesPorUsuarioId(userId);  
      setSolicitudes(data);
      initializeProgress(data);
    } catch (error) {
      console.error("Error al obtener solicitudes:", error);
    }
  };

  const fetchSolicitudPorId = async () => {
    if (!userId) {
      console.log('Por favor ingrese un ID de solicitud.');
      return;
    }
    try {
      const data = await obtenerSolicitudesPorUsuarioId(userId);
      if (data) {
        setSolicitudSeleccionada(data);
      } else {
        console.log('No se encontró la solicitud con ese ID');
      }
    } catch (error) {
      console.error('Error al obtener la solicitud:', error);
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
        return 0.25;  // 25% de progreso
      case 'En proceso':
        return 0.6;   // 60% de progreso
      case 'Solucionado':
        return 1;     // 100% de progreso
      default:
        return 0;     // Sin progreso
    }
  };

  const avanzarEstado = async (solicitud: Solicitud) => {
    const currentIndex = estados.indexOf(solicitud.estado);
    if (currentIndex < estados.length - 1) {
      const nuevoEstado = estados[currentIndex + 1];
      try {
        await actualizarSolicitud(solicitud._id, { estado: nuevoEstado });

        // Actualizamos el estado local sin recargar todo
        setSolicitudes((prevState) => 
          prevState.map((s) => 
            s._id === solicitud._id ? { ...s, estado: nuevoEstado } : s
          )
        );

        Animated.timing(progress[solicitud._id], {
          toValue: getProgress(nuevoEstado),
          duration: 500,
          useNativeDriver: false, // Necesario ya que estamos animando valores no transformables directamente
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
            style={[styles.progressBar, {
              width: progress[item._id].interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            }]}
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
      <TextInput
        style={styles.input}
        placeholder="Ingrese ID de la solicitud"
        value={solicitudId}
        onChangeText={setSolicitudId}
      />
      <Button title="Buscar Solicitud" onPress={fetchSolicitudPorId} />

      {solicitudSeleccionada ? (
        <View style={styles.card}>
          <Text style={styles.title}>{solicitudSeleccionada.categoria}</Text>
          <Text>{solicitudSeleccionada.descripcion}</Text>
          <Text>Estado: {solicitudSeleccionada.estado}</Text>
        </View>
      ) : (
        <FlatList
          data={solicitudes}
          keyExtractor={(item) => item._id}
          renderItem={renderSolicitud}
        />
      )}
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
