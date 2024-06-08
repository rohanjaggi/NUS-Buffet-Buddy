import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import BuffetListings from './buffetListings';
import Photopicker from './PhotoPicker'; // Replace with actual screen components

const Tab = createBottomTabNavigator();

function BuffetListingsTabs() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator >
        <Tab.Screen name="BuffetListings" component={BuffetListings} options={{ title: 'Buffet Listings' }} />
        <Tab.Screen name="Photopicker" component={Photopicker} options={{ title: 'Photo Picker' }} />
        {/* Add more screens here */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default BuffetListingsTabs;
