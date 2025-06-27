// App.tsx
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from '../src/navigation/AuthContext';
// import AppNavigator from './AppNavigation';
import {Provider} from 'react-redux';
import AppNavigator from '../src/navigation/AppNavigator';
// import { store } from '../src/redux/store';
import store from '../src/redux/store';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
