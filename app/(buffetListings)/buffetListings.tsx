import { Link } from "expo-router";
// import React = require("react");
import React from 'react';
import { View, Text, StyleSheet } from "react-native"

const BuffetListings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the buffet listings page!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#001a4d', // Optional: Set the background color for the container
  },
  text: {
    color: '#fff', // White color for the text
    fontSize: 30,  // Optional: Set the font size
    fontFamily: 'System',
  },
  link: {
    color: '#fff', // White color for the text
    fontSize: 18,  // Optional: Set the font size
    fontFamily: 'System',
  }
});


export default BuffetListings