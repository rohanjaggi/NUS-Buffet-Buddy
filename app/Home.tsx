import { View, Text, StyleSheet, Button, Pressable} from "react-native"
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';


const HomePage = () => {
    const navigation = useNavigation();
  
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to NUS Buffet Buddy!</Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>
            Login
          </Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Create Account')}>
          <Text style={styles.link}>
            Create Account
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
  
  export default HomePage;