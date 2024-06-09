import { FIREBASE_AUTH } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FIREBASE_DB } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import HomePage from '.././Home'

const Profile = () => {
  const navigation = useNavigation(); // Get the navigation object

  const handleLogout = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigation.navigate('HomePage');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // button still broken, haven't figured out how to navigate back to log in screen
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fff', // Optional: Set the background color for the container
  },
  buttonText: {
    color: '#001a4d', // White color for the text
    fontSize: 20,  // Optional: Set the font size
    fontFamily: 'Nunito_500Medium',
    textAlign: 'center',
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


export default Profile