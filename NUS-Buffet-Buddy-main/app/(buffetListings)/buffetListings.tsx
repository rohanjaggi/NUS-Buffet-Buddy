import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Switch, Button, Image } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { FIREBASE_RDB } from '../../firebase/firebase';
import Modal from 'react-native-modal'; // to create the dropdown for the filters
import Icon from 'react-native-vector-icons/FontAwesome'; // for the filter icon
import logo from '../../assets/sign.png';

const BuffetListings = ({ navigation }) => {
  const [foodListings, setFoodListings] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [halalFilter, setHalalFilter] = useState(false);
  const [cutleryFilter, setCutleryFilter] = useState(false);
  const [timeFilter, setTimeFilter] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const foodListingsRef = ref(FIREBASE_RDB, 'foodListings');

  useEffect(() => {
    onValue(foodListingsRef, (dataSnapshot) => {
      const foodListingsData = dataSnapshot.val() || {};
      const listingsArray = Object.entries(foodListingsData).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      const filteredListings = filterListings(listingsArray);
      setFoodListings(filteredListings.reverse());
    });
  }, [searchText, halalFilter, cutleryFilter, timeFilter]);

  const filterListings = (listings) => {
    return listings.filter(item => (
      (!searchText || 
        item.description.toLowerCase().includes(searchText.toLowerCase()) || 
        item.foodAvail.toLowerCase().includes(searchText.toLowerCase()) ||
        item.location.toLowerCase().includes(searchText.toLowerCase())
      ) &&
      (!halalFilter || item.halalCert === true) &&
      (!cutleryFilter || item.cutleryAvail === true) &&
      (!timeFilter || remainingTime(item.clearTime) > 30)
    ));
  };

  const remainingTime = (clearTime) => {
    const now = new Date();
    const clearDate = new Date(clearTime);
    return (clearDate - now) / 60000; // convert milliseconds to minutes
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${formattedTime} ${formattedDate}`;
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>
      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search Food Available..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity onPress={toggleModal}>
          <Icon name="filter" size={30} color='#00008b' />
        </TouchableOpacity>
      </View>

      <FlatList
        data={foodListings}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ListingDetails', { listingId: item.id, listingData: item })}>
            <View style={styles.listingContainer}>
              
              <View style={styles.listingHeader}>
                <Text style={styles.listingTitle}>#{item.listingID} - {item.location}</Text>
              </View>

              <View style={styles.listingDetails}>
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>Food Available: </Text>{item.foodAvail}
                </Text>

                <Text>
                  <Text style={{ fontWeight: 'bold' }}>Location: </Text>{item.location}
                </Text>

                <Text>
                  <Text style={{ fontWeight: 'bold' }}>Clear Time: </Text>{formatDateTime(item.clearTime)}
                </Text>

                <Text>
                  <Text style={{ fontWeight: 'bold' }}>Allergens: </Text>{item.allergens}
                </Text> 
              </View>

            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filters</Text>
          <View style={styles.switchContainer}>
            <Text>Halal Certification</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={halalFilter ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={setHalalFilter}
              value={halalFilter}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text>Cutlery Availablility</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={cutleryFilter ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={setCutleryFilter}
              value={cutleryFilter}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text>Over 30 Minutes Till Clear</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={timeFilter ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={setTimeFilter}
              value={timeFilter}
            />
          </View>
          <Button title="Close" onPress={toggleModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0, 
    paddingVertical: 0, 
  },
  logoContainer: {
    alignItems: 'center',
    backgroundColor: '#001a4d',
    width: '100%',

  },
  logo: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    padding: 2, 
    borderRadius: 20, 
    backgroundColor: '#fff', 
    marginRight: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    fontSize: 16,
    borderRadius: 18, 
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 1, height: 1 },
    elevation: 3,
  },
  listingContainer: {
    backgroundColor: '#fff',
    padding: 0,
    marginVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginHorizontal: 8
  },
  listingHeader: {
    backgroundColor: '#001a4d',
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  listingDetails: {
    padding: 16,
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
});

export default BuffetListings;
