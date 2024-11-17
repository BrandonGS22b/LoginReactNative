import React from 'react';
import { View, Text, Button } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
};

type Props = StackScreenProps<RootStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
      <Text>Dashboard Screen</Text>
      <Button title="Logout" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

export default DashboardScreen;
