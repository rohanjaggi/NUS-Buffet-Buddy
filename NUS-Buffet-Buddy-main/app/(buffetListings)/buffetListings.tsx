import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { FIREBASE_RDB } from '../../firebase/firebase';
import { ref, onValue } from 'firebase/database';

// sets up listener to grab info from RDB whenever it's updated
const foodListingsRef = ref(FIREBASE_RDB, 'foodListings');

const BuffetListings = ({ navigation }) => {
  const [foodListings, setFoodListings] = useState([]);

  useEffect(() => {
    onValue(foodListingsRef, (dataSnapshot) => {
      const foodListingsData = dataSnapshot.val();
      const listingsArray = Object.entries(foodListingsData).map(([key, value]) => ({
        id: key,
        ...value, // spread the value object to extract all key-value pairs
      }));
      setFoodListings(listingsArray.reverse());
    });
  }, []);

  // format ISO string to date and time
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <FlatList
      data={foodListings}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('ListingDetails', { listingId: item.id, listingData: item })}>
          <View style={styles.listingContainer}>
            <View style={styles.listingHeader}>
              <Text style={styles.listingTitle}>#{item.listingID}</Text>
            </View>

            <View style={styles.listingDetails}>
              <Text>Food Available: {item.foodAvail}</Text>
              <Text>Location: {item.location}</Text>
              <Text>Clear Time: {formatDateTime(item.clearTime)}</Text>
              <Text>Allergens: {item.allergens}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: 20,
  },
  listingContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginHorizontal: 8
  },
  listingHeader: {
    marginBottom: 10,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listingDetails: {
    fontSize: 16,
  },
});

export default BuffetListings;