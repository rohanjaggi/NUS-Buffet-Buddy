import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDoc, doc } from 'firebase/firestore';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { FIREBASE_RDB, FIREBASE_DB, firebase } from '../../firebase/firebase';
import { ref, set, push, get, runTransaction } from 'firebase/database';
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

    const resetFields = () => {
        setFoodAvail('');
        setDescription('');
        setLocation('');
        setClearTime(new Date());
        setAllergens('');
        setCutleryAvail(false);
        setHalalCert(false);
    };

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
                const currIdRef = ref(FIREBASE_RDB, 'currListingID');
                let listingID;
                await runTransaction(currIdRef, (currentValue) => {
                    listingID = currentValue;
                    return currentValue + 1;
                });
                const foodListRef = ref(FIREBASE_RDB, 'foodListings');
                const newFoodRef = push(foodListRef);
                set(newFoodRef, {
                    listingID: listingID,
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
                resetFields();
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
        <ScrollView style={styles.container}>
            <View style={styles.container}>
                <Text style={styles.title}>Create a Listing.</Text>
                <TouchableOpacity style={styles.picButton} onPress={() => navigation.navigate('PhotoPicker')}>
                    <Text style={styles.buttonText}>
                        Add Picture
                    </Text> 
                </TouchableOpacity>

                <Text style={styles.label}>Food Available</Text>
                <TextInput
                    style={styles.input}
                    value={foodAvail}
                    onChangeText={setFoodAvail}
                    placeholder="What food is available?"
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Any description?"
                />

                <Text style={styles.label}>Location</Text>
                <TextInput
                    style={styles.input}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Where is the food Available?"
                />

                <Text style={styles.label}>Allergens</Text>
                <TextInput
                    style={styles.input}
                    value={allergens}
                    onChangeText={setAllergens}
                    placeholder="Are there any allergens?"
                />

                <View style={styles.switchContainer}>
                    <Text style={styles.label}>Halal Certification</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        value={halalCert}
                        onValueChange={setHalalCert} />
                </View>
                
                <View style={styles.switchContainer}>
                    <Text style={styles.label}>Cutlery Availability</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    label: {
        fontSize: 20,
        marginBottom: 8,
        fontWeight: 'bold',
        color: '#00008b'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
        borderRadius: 20
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    timeContainer: {
        marginBottom: 12,
        borderRadius: 5,
        width: 330,
        alignSelf: 'center',
    },
    button: {
        backgroundColor: '#ff9900',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginBottom: 20,
        width: 330,
        fontWeight: 'heavy',
        alignSelf: 'center',
    }, 
    text: {
        color: '#fff', 
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold'
      },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#00008b',
        textAlign: 'center',
      },
      picButton: {
        backgroundColor: '#00008b',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginBottom: 20,
        width: 150,
        fontWeight: 'bold',
        alignSelf: 'center',
      },
      buttonText: {
        color: '#fff', 
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold'
      }
});

export default CreateListings;