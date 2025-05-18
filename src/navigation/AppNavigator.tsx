// AppNavigation.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, ActivityIndicator} from 'react-native';
import {useAuth} from './AuthContext';

import LoginScreen from '../../main/modules/screens/LoginScreen';
// import RegisterScreen from './modules/screens/RegisterScreen';
import SimpleFoodDeliveryApp from '../../main/modules/screens/HomeScreen';
import FoodItemScreen from '../../main/modules/screens/FoodItemScreen';
import CartScreen from '../../main/modules/screens/CartScreen';
import OrdersScreen from '../../main/modules/screens/OrdersScreen';
import AccountScreen from '../../main/modules/screens/AccountScreen';
import SearchScreen from '../../main/modules/screens/SearchScreen';
import AddressScreen from '../../main/modules/screens/AddressScreen';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Define your navigation types
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  FoodItemScreen: undefined;
  CartScreen: undefined;
};

export type MainStackParamList = {
  HomeTabs: undefined;
  FoodItemScreen: {restaurantId: number; restaurantName: string};
  CartScreen: undefined;
  AddressScreen: {addressId: number; userId: number};
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Orders: undefined;
  Account: undefined;
};

// Create navigators
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Auth Navigator (Login/Register screens)
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      {/* <AuthStack.Screen name="Register" component={RegisterScreen} /> */}
      <AuthStack.Screen name="FoodItemScreen" component={FoodItemScreen} />
      <AuthStack.Screen name="CartScreen" component={CartScreen} />
    </AuthStack.Navigator>
  );
};

// Tab Navigator (Bottom tabs)
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'magnify' : 'magnify';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'clipboard-list' : 'clipboard-list-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <Icon name={'arrowLeft'} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6008',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={SimpleFoodDeliveryApp} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="HomeTabs"
        component={TabNavigator}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="FoodItemScreen"
        component={FoodItemScreen}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="AddressScreen"
        component={AddressScreen}
        options={{headerShown: false}}
      />
    </MainStack.Navigator>
  );
};

// Root Navigator (Controls Auth vs Main flow)
const AppNavigator = () => {
  const auth = useAuth();
  const {userToken, loading} = auth;

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#FF6008" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
