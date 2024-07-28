import { FIREBASE_AUTH } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { FIREBASE_DB } from '../../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import sign from '../../assets/sign.png';
import * as Notifications from 'expo-notifications';

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
        console.log(userDoc.data());
        setUserName(userDoc.data().name);
      } catch (error: any) {
        console.error('Error fetching username', error); //catch any errors
      } finally {
        setLoading(false);
      }
    };

    // function to request permission for notifications, and save their expoPushToken to firestore
    const registerForPushNotificationsAsync = async () => {
      let token;
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notification!');
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;

      console.log(token);

      // Save the token to Firestore
      if (userId) {
        const userDocRef = doc(FIREBASE_DB, 'users', userId);
        await setDoc(userDocRef, { expoPushToken: token }, { merge: true });
      }
    };

    fetchUserName();
    registerForPushNotificationsAsync();
  }, [userId]);

  const handleLogout = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
  <View style={styles.container} >
    <Image source={sign} style={styles.logo} />
    {userName ? <Text style={styles.welcome}>Welcome, {userName}!</Text> : null}

    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BuffetTabsLayout')}>
      <Text style={styles.link}>Open Listings</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.link}>Log Out</Text>
    </TouchableOpacity>
  </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#001a4d', 
    paddingBottom: 100,
  },
  text: {
    color: '#fff', 
    fontSize: 26, 
    fontWeight: 'bold'
  },
  link: {
    color: '#fff', 
    fontSize: 24,  

    textAlign: 'center',
    fontWeight: 'bold'
  },
  welcome: {
    color: '#fff',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Rubik_400Regular',
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
    borderRadius: 20,
    marginVertical: 10,
    width: 250,
    textAlign: 'center',
  }
});

export default List;



/*
import React, { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

// Notification handler to manage foreground notifications
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  // Function to register for push notifications and get the device's push token
  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
*/