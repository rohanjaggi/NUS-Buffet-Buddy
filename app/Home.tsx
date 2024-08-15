import { View, Text, StyleSheet, Pressable, Image, TouchableOpacity} from "react-native"
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import logo from '../assets/logo.png';
import { useFonts, Rubik_400Regular } from '@expo-google-fonts/rubik';

const HomePage = () => {
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.text}>
          Login
          </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Create Account')}>
          <Text style={styles.text}>
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
      backgroundColor: '#001a4d' 
    },
    text: {
      color: '#fff', 
      fontSize: 20,  
      textAlign: 'center',
      fontWeight: 'bold'
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
        borderRadius: 20,
        marginVertical: 10,
        width: 250,
        textAlign: 'center'
    }
  });
  
  export default HomePage;