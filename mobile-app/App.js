import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ServerListScreen from './src/screens/ServerListScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2563eb',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'برنامه VPN' }}
        />
        <Stack.Screen 
          name="ServerList" 
          component={ServerListScreen}
          options={{ title: 'لیست سرورها' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

