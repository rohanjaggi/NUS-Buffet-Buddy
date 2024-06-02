import { View, Text, StyleSheet, Button, Pressable} from "react-native"
import { Link, router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './(login)/Login'; // Update the path as necessary

const Stack = createNativeStackNavigator();

function App() {
  return (
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
  );
}

const HomePage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to NUS Buffet Buddy!</Text>
      <Pressable onPress={() => router.push("Login")}>
        <Text style={styles.link}>
          Login
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#001a4d', // Optional: Set the background color for the container
  },
  text: {
    color: '#fff', // White color for the text
    fontSize: 32,  // Optional: Set the font size
    fontFamily: 'System',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  link: {
    color: '#ff9900', // White color for the text
    fontSize: 24,  // Optional: Set the font size
    fontFamily: 'System',
    textDecorationLine: 'underline', // Underline the text
  }
});

export default HomePage


/*
how to link using .push method from router
remember to import router(expo-router) and pressable(react-native)
<Pressable onPress={() => router.push("/buffetListings/buffetListings")}>
        <Text>
          Go to buffet listings
        </Text>
      </Pressable> */