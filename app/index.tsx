// import React = require("react");
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Login from './(login)/Login';
import CreateAccount from "./(login)/CreateAccount";
import BuffetListings from './(buffetListings)/buffetListings';
import Photopicker from './(buffetListings)/PhotoPicker';
import HomePage from "./Home";
import List from "./(login)/List";

// Create the three separate navigators
const Stack = createNativeStackNavigator(); // Navigator for before logging in
const InsideStack = createNativeStackNavigator(); // Navigator for after loggin in
const Tab = createBottomTabNavigator(); // Navigator for bottom tabs in main app page

// Navigator for bottom tabs in main app page
function BuffetTabsLayout() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator >
        <Tab.Screen name="BuffetListings" component={BuffetListings} options={{ title: 'Buffet Listings' }} />
        <Tab.Screen name="Photopicker" component={Photopicker} options={{ title: 'Photo Picker' }} />
        {/* Add more screens here */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Navigator for after loggin in
function InsideLayout() {
  return (
    <InsideStack.Navigator screenOptions={ {headerShown: false} }>
      <InsideStack.Screen name="List" component={List} options={{ headerShown: false }} />
      <InsideStack.Screen name="BuffetTabsLayout" component={BuffetTabsLayout} />
    </InsideStack.Navigator>
  );
}

// Navigator for before logging in
function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" 
          component={HomePage}
        />

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