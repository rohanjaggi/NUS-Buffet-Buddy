import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native"

const BuffetListings = () => {
  const [people, setPeople] = useState([
    { name: 'Rohan', id: '1' },
    { name: 'Yashi', id: '2' },
    { name: 'Shruti', id: '3' },
    { name: 'Dhwani', id: '4' },
    { name: 'Shraddha', id: '5' },
    { name: 'Aayush', id: '6' },
    { name: 'Shruthi', id: '7' },
  ]);
  
  return (
    <View style={styles.container}>

      <ScrollView>
        { people.map((item) => {
          return (
            <View key={item.id}>
              <Text style={styles.item}> {item.name} </Text>
            </View>  
          )
        })}
      </ScrollView>

    </View>
  )
}

{/* <View style={styles.container}>
      <Text style={styles.text}>Replace me with listings</Text>
    </View> */}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Optional: Set the background color for the container
    paddingTop: 40,
    paddingHorizontal: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
    
  },
  text: {
    color: 'navy', // White color for the text
    fontSize: 30,  // Optional: Set the font size
    fontFamily: 'Nunito_500Medium',
  },
  item: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 24,
    padding: 30,
    backgroundColor: '#001a4d',
    fontSize: 24,
    color: '#fff'
  },
});


export default BuffetListings