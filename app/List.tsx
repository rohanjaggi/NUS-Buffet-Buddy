import { FIREBASE_AUTH } from '@/firebase/firebase';
import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View, Text, Button } from 'react-native';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
  return (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Button onPress= {() => navigation.navigate('BuffetListings')} title="Open Listings" />
    <Button onPress= {() => FIREBASE_AUTH.signOut()} title="Log Out" />
  </View>
  );
};

export default List;