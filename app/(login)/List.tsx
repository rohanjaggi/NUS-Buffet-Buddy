import { FIREBASE_AUTH } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { FIREBASE_DB } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import sign from '../../assets/sign.png';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}


const List = ({ navigation }: RouterProps) => {
  // add the ability to show username upon successful login
  const route = useRoute();
  const { userId } = route.params; // not sure why it is underlined red

  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userId));
        setUserName(userDoc.data().name);
      } catch (error: any) {
        console.error('Error fetching username', error); //catch any errors
      } finally {
        setLoading(false);
      }
    };
    fetchUserName();
  }, [userId]);

  const handleLogout = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigation.navigate('Login');
      // Navigate to the login screen if needed
      // For example:
      // navigation.navigate('Login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
  <View style={styles.container} >
    <Image source={sign} style={styles.logo} />
    {userName ? <Text style={styles.welcome}>Welcome, {userName}!</Text> : null}

    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BuffetListings')}>
      <Text style={styles.link}>Open Listings</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.link}>Log Out</Text>
    </TouchableOpacity>
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
    paddingBottom: 100,
  },
  text: {
    color: '#fff', // White color for the text
    fontSize: 26,  // Optional: Set the font size
    fontFamily: 'System',
  },
  link: {
    color: '#fff', // bright orange color 
    fontSize: 24,  // Optional: Set the font size
    fontFamily: 'System',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  welcome: {
    color: '#fff',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'System',
    fontWeight: 'bold'
  },
  logo: {
    width: 200,
    height: 150,
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