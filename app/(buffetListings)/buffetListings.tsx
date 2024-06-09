import React from 'react';
import { View, Text, StyleSheet } from "react-native"

const BuffetListings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Replace me with listings</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Optional: Set the background color for the container
  },
  text: {
    color: 'navy', // White color for the text
    fontSize: 30,  // Optional: Set the font size
    fontFamily: 'Nunito_500Medium',
  },
});


export default BuffetListings