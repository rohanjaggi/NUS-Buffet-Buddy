// import React = require("react");
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './(login)/Login';
import CreateAccount from "./(login)/CreateAccount";
import BuffetListingsTabs from "./(buffetListings)/buffetTabs";
import BuffetListings from './(buffetListings)/buffetListings';
import HomePage from "./Home";
import List from "./(login)/List";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Create Account" component={CreateAccount} />
        <Stack.Screen name="List" component={List} options={{ headerShown: false }}/>
        <Stack.Screen name="BuffetListings" component={BuffetListings} />
        {/* <Stack.Screen name="BuffetListingsTabs" component={BuffetListingsTabs} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

// import { Text, View } from "react-native";
// import { StatusBar } from 'expo-status-bar';
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import Login from "./(login)/Login";
// import List from "./(login)/List";
// import { User, onAuthStateChanged } from "firebase/auth";
// import { useEffect, useState } from "react";
// import { FIREBASE_AUTH } from "../firebase/firebase";
// import BuffetListings from "./(buffetListings)/buffetListings";
// import CreateAccount from "./(login)/CreateAccount";
// import React from "react";
// import BuffetListingsTabs from "./(buffetListings)/buffetTabs";
// import HomePage from "./Home";

// const Stack = createNativeStackNavigator();

// const InsideStack = createNativeStackNavigator();

// function InsideLayout() {
//   return (
//     <InsideStack.Navigator screenOptions={ {headerShown: null} }>
//       {/* <InsideStack.Screen name="List" component={List} />
//       <InsideStack.Screen name="BuffetListings" component={BuffetListings} /> */}
//       <InsideStack.Screen name="List" component={List} options={{ headerShown: false }} />
//       <InsideStack.Screen name="BuffetListings" component={BuffetListingsTabs} />
//     </InsideStack.Navigator>
//   );
// }

// export default function index() {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
//       console.log('user', user);
//       setUser(user);
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <NavigationContainer independent={true}>
//       <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
//         <Stack.Screen name="Home" component={HomePage} />
//         {user ? (
//           <Stack.Screen name="Inside" component={InsideLayout} options={{ headerShown: false }} />
//         ) : (
//           <>
//             <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
//             <Stack.Screen name="Create Account" component={CreateAccount} options={{ headerShown: false }} />
//           </>
//         )}
//         {/* <Stack.Screen name="Login" component={Login} />
//         <Stack.Screen name="Create Account" component={CreateAccount} /> */}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: null }}>
//         {user ? (
//           <Stack.Screen name="Inside" component={InsideLayout} options={{ headerShown: false }} />
//         ) : (
//           <>
//             <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
//             <Stack.Screen name="Create Account" component={CreateAccount} options={{ headerShown: false }} />
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
//   return (
//     <NavigationContainer independent={true}>
//       <Stack.Navigator initialRouteName="Login" screenOptions={ {headerShown: null} }>  
//         <Stack.Screen name='CA' component={CreateAccount} options={{ headerShown: false }} />
//         <Stack.Screen name='Inside' component={InsideLayout} options={{ headerShown: false }} />
//         <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
//         {/* {user ? (
//           <Stack.Screen name='Inside' component={InsideLayout} options={{ headerShown: false }} />
//         ) : (
//           <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
//         )} */}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }