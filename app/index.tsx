import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomePage from "./Home";
import Login from './(login)/Login';
import CreateAccount from "./(login)/CreateAccount";
import List from "./(login)/List";
import BuffetListings from './(buffetListings)/buffetListings';
import Photopicker from './(buffetListings)/PhotoPicker';
import Profile from './(buffetListings)/profile';
import CreateListings from './(buffetListings)/createListings';

// Create the three separate navigators
const Stack = createNativeStackNavigator(); // Navigator for before logging in
const InsideStack = createNativeStackNavigator(); // Navigator for after logging in
const Tab = createBottomTabNavigator(); // Navigator for bottom tabs in main app page

// Navigator for bottom tabs in main app page
function BuffetTabsLayout({ route }) {
  const { userId } = route.params; // Get userId from route params
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'BuffetListings') {
            iconName = 'list-circle';
          } else if (route.name === 'Photopicker') {
            iconName = 'camera';
          } else if (route.name === 'Profile') {
            iconName = 'person-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ffae00',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#001a4d',
          paddingBottom: 10,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          fontFamily: 'Nunito_500Medium',
        },
      })}
    >
      <Tab.Screen name="BuffetListings" component={BuffetListings}
        options={{
          title: 'Buffet Listings',
          headerStyle: { backgroundColor: '#001a4d' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontFamily: 'Nunito_500Medium', },
        }}
        initialParams={{ userId }} // Pass userId to BuffetListings
      />
      <Tab.Screen name="Photopicker" component={Photopicker}
        options={{
          title: 'Photo Picker',
          headerStyle: { backgroundColor: '#001a4d' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontFamily: 'Nunito_500Medium', },
        }}
        initialParams={{ userId }} // Pass userId to Photopicker
      />
      <Tab.Screen name="Profile" component={Profile}
        options={{
          headerStyle: { backgroundColor: '#001a4d' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontFamily: 'Nunito_500Medium', },
        }}
        initialParams={{ userId }} // Pass userId to Profile
      />
    </Tab.Navigator>
  );
}

// Navigator for after logging in
function InsideLayout({ route }) {
  const { userId } = route.params;

  return (
    <InsideStack.Navigator screenOptions={{ headerShown: false }}>
      <InsideStack.Screen name="List" component={List} initialParams={{ userId }} />
      <InsideStack.Screen name="BuffetTabsLayout" component={BuffetTabsLayout} initialParams={{ userId }} />
      <InsideStack.Screen name="CreateListings" component={CreateListings} initialParams={{ userId }} />
    </InsideStack.Navigator>
  );
}

// Main App Navigator for before logging in
function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Login"
          component={Login}
          options={{
            headerShown: true,
            title: '',
          }}
        />
        <Stack.Screen name="Create Account"
          component={CreateAccount}
          options={{
            headerShown: true,
            title: '',
          }}
        />
        <Stack.Screen name="InsideLayout" component={InsideLayout} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;