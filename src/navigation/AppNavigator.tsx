import React, {useRef} from 'react';
import {View} from 'react-native';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PortalProvider, PortalHost} from '@gorhom/portal';

// import LoginScreen from './screens/LoginScreen';
import LoginScreen from '../../main/modules/screens/LoginScreen';
import HomeScreen from '../../main/modules/screens/HomeScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const routeNameRef = useRef<string | undefined>(undefined);
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  return (
    <View style={{flex: 1}}>
      <SafeAreaProvider>
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            routeNameRef.current =
              navigationRef.current?.getCurrentRoute()?.name;
          }}
          onStateChange={() => {
            const previous = routeNameRef.current;
            const current = navigationRef.current?.getCurrentRoute()?.name;
            if (previous !== current) {
              routeNameRef.current = current;
              console.log(`Navigated: ${previous} ➝ ${current}`);
            }
          }}>
          <PortalProvider>
            <Stack.Navigator
              screenOptions={{headerShown: false}}
              initialRouteName="Login">
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
            <PortalHost name="global" />
          </PortalProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </View>
  );
};

export default AppNavigator;
