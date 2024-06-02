import { FIREBASE_AUTH } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Button, Pressable, StyleSheet } from 'react-native';
import { router, Link } from 'expo-router';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const handleLogout = async () => {
  try {
    await FIREBASE_AUTH.signOut();
    // Navigate to the login screen if needed
    // For example:
    // navigation.navigate('Login');
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};


const List = ({ navigation }: RouterProps) => {
  return (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>

    <Link href="../buffetListings" asChild>
      <Pressable>
        <Text style={styles.link}>Open Listings</Text>
      </Pressable>
    </Link>
    {/* <Button onPress= {() => navigation.navigate('BuffetListings')} title="Open Listings" /> */}


    <Link href="/Login" asChild>
      <Pressable onPress={handleLogout}>
        <Text style={styles.link}>Log Out</Text>
      </Pressable>
    </Link>
    {/* <Button onPress={() => {
      navigation.navigate('Login');
      FIREBASE_AUTH.signOut();}}
      title="Log Out"
    /> */}
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
    fontSize: 26,  // Optional: Set the font size
    fontFamily: 'System',
  },
  link: {
    color: '#ff9900', // bright orange color 
    fontSize: 18,  // Optional: Set the font size
    fontFamily: 'System',
    textDecorationLine: 'underline', // Underline the text
  }
});

export default List;



/* <Pressable onPress={() => router.push("../buffetListings")}>
        <Text style={styles.link}>
          Open Buffet Listings
        </Text>
      </Pressable> */

    /* <Link href="./Login">Log Out</Link> */

    /* <Pressable onPress={() => {
      FIREBASE_AUTH.signOut()
      router.push("./Login")}}> 
    
        <Text style={styles.link}>
          Log Out
        </Text>
      </Pressable> */