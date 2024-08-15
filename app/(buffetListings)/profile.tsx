import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_RDB } from '../../firebase/firebase';
import { signOut, getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { ref, onValue } from 'firebase/database';
import profilePic from '../../assets/profilePic.png';
import Modal from 'react-native-modal'; 

const Profile = () => {
  const navigation = useNavigation(); 
  const currentUser = getAuth().currentUser;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [scheduledListings, setScheduledListings] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isScheduledModalVisible, setScheduledModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(FIREBASE_DB, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name);
          setEmail(userData.email);
          setRole(userData.role);
          if (userData.role === 'Organiser') {
            fetchUserListings();
            fetchScheduledListings();
          }
        } else {
          console.log('No user data found!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserListings = async () => {
      const foodListingsRef = ref(FIREBASE_RDB, 'foodListings');
      onValue(foodListingsRef, (dataSnapshot) => {
        const foodListingsData = dataSnapshot.val() || {};
        const currentDate = new Date();
        const past30Days = new Date(currentDate.setDate(currentDate.getDate() - 30));
        const userListings = Object.entries(foodListingsData)
          .filter(([key, value]) => value.userId === currentUser.uid && new Date(value.clearTime) > past30Days)
          .map(([key, value]) => ({
            id: key,
            ...value,
          }));
        setListings(userListings.reverse());
      });
    };

    const fetchScheduledListings = async () => {
      const foodListingsRef = ref(FIREBASE_RDB, 'foodListings');
      onValue(foodListingsRef, (dataSnapshot) => {
        const foodListingsData = dataSnapshot.val() || {};
        const currentDate = new Date();
        const scheduledUserListings = Object.entries(foodListingsData)
          .filter(([key, value]) => value.userId === currentUser.uid && new Date(value.activeTime) > currentDate)
          .map(([key, value]) => ({
            id: key,
            ...value,
          }));
        setScheduledListings(scheduledUserListings.reverse());
      });
    };

    fetchUserData();
  }, [currentUser]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleScheduledModal = () => {
    setScheduledModalVisible(!isScheduledModalVisible);
  };

  const handleListingPress = (listingId, listingData) => {
    setModalVisible(false); 
    setScheduledModalVisible(false);
    navigation.navigate('ListingDetails', { listingId, listingData });
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${formattedTime} ${formattedDate}`;
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleLogout = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/sign.png')} style={styles.logo} />
        <Text style={styles.title}>Profile.</Text>
      </View>
      <Image source={profilePic} style={styles.profileImage} />
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.text}>{name}</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.text}>{email}</Text>
      <Text style={styles.label}>Role:</Text>
      <Text style={styles.text}>{role}</Text>
      {role === 'Organiser' && (
        <View>
          <TouchableOpacity style={styles.myListingButton} onPress={toggleModal}>
            <Text style={styles.myListingButtonText}>My Listings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.myListingButton} onPress={toggleScheduledModal}>
            <Text style={styles.myListingButtonText}>Scheduled Listings</Text>
          </TouchableOpacity>
          <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>My Listings (Last 30 Days)</Text>
              <FlatList
                data={listings}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleListingPress(item.id, item)}>
                    <View style={styles.listingContainer}>
                      <View style={styles.listingHeader}>
                        <Text style={styles.listingTitle}>#{item.listingID} - {item.location}</Text>
                      </View>
                      <View style={styles.listingDetails}>
                        <Text><Text style={{ fontWeight: 'bold' }}>Food Available: </Text>{item.foodAvail}</Text>
                        <Text><Text style={{ fontWeight: 'bold' }}>Location: </Text>{item.location}</Text>
                        <Text><Text style={{ fontWeight: 'bold' }}>Clear Time: </Text>{formatDateTime(item.clearTime)}</Text>
                        <Text><Text style={{ fontWeight: 'bold' }}>Allergens: </Text>{item.allergens}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
              />
              <TouchableOpacity style={styles.button} onPress={toggleModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={isScheduledModalVisible} onBackdropPress={toggleScheduledModal}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Scheduled Listings</Text>
              <FlatList
                data={scheduledListings}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleListingPress(item.id, item)}>
                    <View style={styles.listingContainer}>
                      <View style={styles.listingHeader}>
                        <Text style={styles.listingTitle}>#{item.listingID} - {item.location}</Text>
                      </View>
                      <View style={styles.listingDetails}>
                        <Text><Text style={{ fontWeight: 'bold' }}>Food Available: </Text>{item.foodAvail}</Text>
                        <Text><Text style={{ fontWeight: 'bold' }}>Location: </Text>{item.location}</Text>
                        <Text><Text style={{ fontWeight: 'bold' }}>Clear Time: </Text>{formatDateTime(item.clearTime)}</Text>
                        <Text><Text style={{ fontWeight: 'bold' }}>Active Time: </Text>{formatDateTime(item.activeTime)}</Text>
                        <Text><Text style={{ fontWeight: 'bold' }}>Allergens: </Text>{item.allergens}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
              />
              <TouchableOpacity style={styles.button} onPress={toggleScheduledModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      )}
      <View style={styles.logOutContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Log Out</Text>
       </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
  logOutContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    marginTop: 40,
    borderWidth: 2,
    color: '#00008b',
  },
  buttonText: {
    color: '#001a4d',
    fontSize: 20, 
    fontFamily: 'Rubik_400Regular',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ff9900',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10,
    width: 250,
    textAlign: 'center'
  },
  myListingButton: {
    backgroundColor: '#001a4d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10,
    width: 250,
    textAlign: 'center'
  },
  myListingButtonText: {
    color: '#fff',
    fontSize: 20, 
    fontFamily: 'Rubik_400Regular',
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center', 
    color:'#00008b'
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#fff',
    textAlign: 'center',
    flex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#001a4d',
    padding: 10,
    borderRadius: 0,
    width: '100%',
    justifyContent: 'center'
  },
  logo: {
    width: 47,
    height: 50,
    position: 'absolute',
    left: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    paddingTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listingContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 8
  },
  listingHeader: {
    backgroundColor: '#001a4d',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  listingDetails: {
    padding: 25,
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default Profile;