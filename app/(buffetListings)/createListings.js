import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDoc, doc } from 'firebase/firestore';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, Switch, TouchableOpacity, Alert } from 'react-native';
import { FIREBASE_RDB } from '../../firebase/firebase';
import { FIREBASE_DB } from '../../firebase/firebase';
import { ref, set, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';


const CreateListings = () => {
    const navigation = useNavigation();
    const currentUser = getAuth().currentUser;

    const [foodAvail, setFoodAvail] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [clearTime, setClearTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [allergens, setAllergens] = useState('');
    const [cutleryAvail, setCutleryAvail] = useState(false);
    const [halalCert, setHalalCert] = useState(false);

    const [userRole, setUserRole] = useState('');
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserRole = async () => {
            try {
                const userDoc = await getDoc(doc(FIREBASE_DB, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    console.log('User data:', userData);
                    setUserName(userData.name);
                    setUserRole(userData.role);
                } else {
                    console.log('No user detected!');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        getUserRole();
    }, [currentUser]);

    const AddListing = async () => {
        if (userRole !== 'Organiser') {
            Alert.alert('Error', 'Only organisers can create a listing');
            return;
        }

        if (foodAvail && description && location && allergens) {
            try {
                const foodListRef = ref(FIREBASE_RDB, 'foodListings');
                const newFoodRef = push(foodListRef);
                set(newFoodRef, {
                    foodAvail,
                    description,
                    location,
                    allergens,
                    cutleryAvail,
                    clearTime: clearTime.toISOString(),
                    halalCert,
                    userId: currentUser.uid,
                    userName
                });
                Alert.alert('Success', 'Food Listing Created!');
                navigation.goBack();
            } catch (error) {
                console.error('Error adding listing:', error);
                Alert.alert('Error', 'Unable to create new listing');
            }
        } else {
            Alert.alert('Incomplete', 'Please fill all require fields');
        }
    };

    const handleTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || clearTime;
        setShowTimePicker(false);
        setClearTime(currentTime);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Listing</Text>
            <Text style={styles.label}>Food Available</Text>
            <TextInput
                style={styles.input}
                value={foodAvail}
                onChangeText={setFoodAvail}
                placeholder="Food Available" />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Description" />

            <Text style={styles.label}>Location</Text>
            <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Location" />

            <Text style={styles.label}>Allergens</Text>
            <TextInput
                style={styles.input}
                value={allergens}
                onChangeText={setAllergens}
                placeholder="Allergens" />

            <View style={styles.switchContainer}>
                <Text style={styles.label}>Halal Certification</Text>
                <Switch
                    value={halalCert}
                    onValueChange={setHalalCert} />
            </View>
            
            <View style={styles.switchContainer}>
                <Text style={styles.label}>Cutlery Availability</Text>
                <Switch
                    value={cutleryAvail}
                    onValueChange={setCutleryAvail} />
            </View>

            <View style={styles.timeContainer}>
                <Button title="Set Clear Time" onPress={() => setShowTimePicker(true)} />
                {showTimePicker && (
                    <DateTimePicker
                        value={clearTime}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={handleTimeChange} />
                )}
            </View>
            <TouchableOpacity style={styles.button} onPress={AddListing}>
                <Text style={styles.text}>
                 Create Listing
                </Text> 
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 20,
        marginBottom: 8,
        fontWeight: 'heavy',

    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    timeContainer: {
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#ff9900',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
        width: 390,
        fontWeight: 'heavy'
    }, 
    text: {
        color: '#fff', // White color for the text
        fontSize: 20,  // Optional: Set the font size
        fontFamily: 'Nunito_500Medium',
        textAlign: 'center',
        fontWeight: 'bold'
      },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        marginBottom: 50,
        color: '#00008b',
        textAlign: 'center',
      }
});

export default CreateListings;