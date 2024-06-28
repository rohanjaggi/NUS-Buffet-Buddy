import { FIREBASE_AUTH } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FIREBASE_DB } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import profilePic from '../../assets/profilePic.png';

const Profile = () => {
  const navigation = useNavigation(); // Get the navigation object
  const currentUser = getAuth().currentUser;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(FIREBASE_DB, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name);
          setEmail(userData.email);
          setRole(userData.role);
        } else {
          console.log('No user data found!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleLogout = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigation.navigate('Login')
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={profilePic} style={styles.profileImage} />
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.text}>{name}</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.text}>{email}</Text>
      <Text style={styles.label}>Role:</Text>
      <Text style={styles.text}>{role}</Text>
      <View style={styles.logOutContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Log Out</Text>
       </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff', // Optional: Set the background color for the container
  },
  logOutContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fff', // Optional: Set the background color for the container
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    marginTop: 40,
    borderWidth: 2,
    color: '#001a4d',
  },
  buttonText: {
    color: '#001a4d',
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
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center', 
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center', 
  }
});


export default Profile