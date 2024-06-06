import { View, Text, StyleSheet, Button, Pressable} from "react-native"
import { Link, router } from 'expo-router';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './(login)/Login';
import CreateAccount from "./(login)/CreateAccount";
import BuffetListings from "./buffetListings";
import HomePage from "./Home";
import List from "./(login)/List";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Home" screenOptions={ {headerShown: null} }>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Create Account" component={CreateAccount} />
        <Stack.Screen name="List" component={List} />
        <Stack.Screen name="BuffetListings" component={BuffetListings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;


/*
how to link using .push method from router
remember to import router(expo-router) and pressable(react-native)
<Pressable onPress={() => router.push("/buffetListings/buffetListings")}>
        <Text>
          Go to buffet listings
        </Text>
      </Pressable> */