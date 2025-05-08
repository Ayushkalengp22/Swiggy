import React, {useEffect, useState, createContext, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ActivityIndicator, Alert, View} from 'react-native';
import {loginUser, registerUser} from '../Api/login/auth';

import LoginScreen from './modules/screens/LoginScreen';
import HomeScreen from './modules/screens/HomeScreen';
import {SafeAreaView} from 'react-native-safe-area-context';

// Define auth context types
type AuthContextType = {
  userToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    phone: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
};

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab navigation when user is authenticated
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{tabBarStyle: {display: 'none'}}}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}} // 👈 Hides the "Home" screen header
      />
    </Tab.Navigator>
  );
}

// Auth provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from storage on app start
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
      } catch (error) {
        console.error('Failed to load auth token:', error);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const token = await loginUser(email, password); // calls actual API
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
    } catch (error) {
      // Alert("wronge credential")
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string,
  ) => {
    setLoading(true);
    try {
      const token = await registerUser(email, password, name, phone); // calls actual API
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{userToken, loading, login, register, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

// Main app component
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

// Navigation component
function AppNavigator() {
  const {userToken, loading} = useAuth();

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {userToken ? (
          <Stack.Screen name="MainApp" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
