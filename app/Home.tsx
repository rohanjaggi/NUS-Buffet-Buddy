import { View, Text, StyleSheet, Pressable, Image, TouchableOpacity} from "react-native"
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import logo from '../assets/logo.png';

const HomePage = () => {
    const navigation = useNavigation();
  
    return (
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>
            Login
            </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Create Account')}>
            <Text style={styles.link}>
            Create Account
            </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      backgroundColor: '#001a4d' // Optional: Set the background color for the container
    },
    text: {
      color: '#fff', // White color for the text
      fontSize: 32,  // Optional: Set the font size
      fontFamily: 'System',
      fontWeight: 'bold',
    },
    link: {
      color: '#fff', // White color for the text
      fontSize: 20,  // Optional: Set the font size
      fontFamily: 'System',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    logo: {
        width: 300,
        height: 120,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#ff9900',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
        width: 250,
        textAlign: 'center'
    }
  });
  
  export default HomePage;