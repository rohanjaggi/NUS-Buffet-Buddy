import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ActivityIndicator } from 'react-native';

import HomePage from "./Home";
import Login from './(login)/Login';
import CreateAccount from "./(login)/CreateAccount";
import List from "./(login)/List";
import BuffetListings from './(buffetListings)/buffetListings';
import PhotoPicker from './(buffetListings)/PhotoPicker';
import Profile from './(buffetListings)/profile';
import CreateListings from './(buffetListings)/createListings';
import ListingDetails from './(buffetListings)/listingDetails';
import { FIREBASE_DB } from '../firebase/firebase';

// Create the three separate navigators
const Stack = createNativeStackNavigator(); // Navigator for before logging in
const InsideStack = createNativeStackNavigator(); // Navigator for after logging in
const Tab = createBottomTabNavigator(); // Navigator for bottom tabs in main app page

// Navigator for bottom tabs in main app page
function BuffetTabsLayout({ route }) {
  const { userId, userRole } = route.params; // Get userId and userRole from route params
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Buffet Listings') {
            iconName = 'list-circle';
          } else if (route.name === 'Photo Picker') {
            iconName = 'camera';
          } else if (route.name === 'Profile') {
            iconName = 'person-circle-outline';
          } else if (route.name === 'Create Listings') {
            iconName = 'add-circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ffae00',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#001a4d',
          paddingBottom: 10,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          fontFamily: 'Rubik_400Regular',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Buffet Listings" initialParams={{ userId }}>
        {({ navigation, route }) => (
          <BuffetListings navigation={navigation} route={route} />
        )}
      </Tab.Screen>

      {userRole === 'Organiser' && (
        <Tab.Screen name="Create Listings" component={CreateListings} initialParams={{ userId }} />
      )}
      
      <Tab.Screen name="Profile" component={Profile} initialParams={{ userId }} />
    </Tab.Navigator>
  );
}

// Navigator for after logging in
function InsideLayout({ route }) {
  const { userId } = route.params;
  const currentUser = getAuth().currentUser;
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userDoc = await getDoc(doc(FIREBASE_DB, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role);
        } else {
          console.log('No user data found!');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <InsideStack.Navigator screenOptions={{ headerShown: false }}>
      <InsideStack.Screen name="List" component={List} initialParams={{ userId }} />
      <InsideStack.Screen name="BuffetTabsLayout" component={BuffetTabsLayout} initialParams={{ userId, userRole }} />
      <InsideStack.Screen name="ListingDetails" component={ListingDetails} 
        initialParams={{ userId }} 
        options={({ route }) => ({ 
          headerShown: true, 
          title: `Listing #${route.params.listingData.listingID}`, // Use the listingId parameter to set the title
          headerStyle: { backgroundColor: '#001a4d' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontFamily: 'Rubik_400Regular', },
        })}  
      />
      <InsideStack.Screen name="PhotoPicker" component={PhotoPicker} 
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#001a4d' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },}}
      />
    </InsideStack.Navigator>
  );
}

// Main App Navigator for before logging in
function App() {

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Login"
          component={Login}
          options={{
            headerShown: true,
            title: '',
          }}
        />
        <Stack.Screen name="Create Account"
          component={CreateAccount}
          options={{
            headerShown: true,
            title: '',
          }}
        />
        <Stack.Screen name="InsideLayout" component={InsideLayout} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
