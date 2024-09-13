import React from 'react';
import { AuthProvider } from '../proyecto/context/AuthContext';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
