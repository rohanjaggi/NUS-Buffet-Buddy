import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDocs, getDoc, doc, collection } from 'firebase/firestore';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, Switch, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { FIREBASE_RDB, FIREBASE_DB } from '../../firebase/firebase';
import { ref, set, push, runTransaction } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const CreateListings = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const currentUser = getAuth().currentUser;

    const [foodAvail, setFoodAvail] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [clearTime, setClearTime] = useState(new Date());
    const [activeTime, setActiveTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showActiveTimePicker, setShowActiveTimePicker] = useState(false);
    const [allergens, setAllergens] = useState('');
    const [cutleryAvail, setCutleryAvail] = useState(false);
    const [halalCert, setHalalCert] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    const [imageURL, setImageURL] = useState('');

    const [userRole, setUserRole] = useState('');
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);

    const resetFields = () => {
        setFoodAvail('');
        setDescription('');
        setLocation('');
        setClearTime(new Date());
        setActiveTime(new Date());
        setAllergens('');
        setCutleryAvail(false);
        setHalalCert(false);
        setIsScheduled(false);
        setImageURL('');
    };

    useEffect(() => {
        const getUserRole = async () => {
            if (currentUser) {
                try {
                    const userDoc = await getDoc(doc(FIREBASE_DB, 'users', currentUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        console.log('User data:', userData);
                        setUserName(userData.name);
                        console.log('userData.name successful:', userData.name);
                        setUserRole(userData.role);
                        console.log('userData.role successful:', userData.role);
                    } else {
                        console.log('No user detected!');
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        getUserRole();
    }, [currentUser]);

    useEffect(() => {
        if (route.params?.imageUrl) {
            setImageURL(route.params.imageUrl);
        }
    }, [route.params?.imageUrl]);

    // Function to send push notification
    const sendPushNotification = async (expoPushToken, location, foodAvail, clearTime) => {
        const message = {
            to: expoPushToken,
            sound: 'default',
            title: `New Buffet at ${location}!`,
            body: `${foodAvail} available until ${new Date(clearTime).toLocaleTimeString()}`,
            data: { someData: 'goes here' },
        };

        try {
            await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Accept-Encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });
        } catch (error) {
            console.error('Error sending push notification:', error);
        }
    };

    // Function to get all users with Expo push tokens and send notifications
    const sendNotificationsToAllUsers = async () => {
        try {
            const usersCollection = collection(FIREBASE_DB, 'users');
            const userSnapshot = await getDocs(usersCollection);
            const expoPushTokens = [];

            // collect all the push tokens for each user
            userSnapshot.forEach((doc) => {
                const userData = doc.data();
                if (userData.expoPushToken) {
                    expoPushTokens.push(userData.expoPushToken);
                }
            });

            // then send push notifications to all users
            await Promise.all(expoPushTokens.map((token) => sendPushNotification(token, location, foodAvail, clearTime)));
        } catch (error) {
            console.error('Error fetching users or sending notifications:', error);
        }
    };

    const AddListing = async () => {
        if (userRole !== 'Organiser') {
            Alert.alert('Error', 'Only organisers can create a listing');
            return;
        }

        if (isScheduled && activeTime > clearTime) {
            Alert.alert('Error', 'Start time cannot be later than clear time');
            return;
        }

        if (foodAvail && description && location && allergens && imageURL) {
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
                    userName,
                    imageURL,
                    isActive: true,
                    activeTime: isScheduled ? activeTime.toISOString() : new Date().toISOString()
                });

                // Send push notifications to all users
                await sendNotificationsToAllUsers();

                Alert.alert('Success', 'Food Listing Created!');
                resetFields();
                navigation.goBack();
            } catch (error) {
                console.error('Error adding listing:', error);
                Alert.alert('Error', 'Unable to create new listing');
            }
        } else {
            Alert.alert('Incomplete', 'Please fill all required fields');
        }
    };

    const handleTimeChange = (event, selectedTime, type) => {
        const currentTime = selectedTime || (type === 'clearTime' ? clearTime : activeTime);
        if (type === 'clearTime') {
            setShowTimePicker(false);
            setClearTime(currentTime);
            if (isScheduled && activeTime > currentTime) {
                setActiveTime(currentTime);
            }
        } else if (type === 'activeTime') {
            setShowActiveTimePicker(false);
            setActiveTime(currentTime);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <Image source={require('../../assets/sign.png')} style={styles.logo} />
                <Text style={styles.title}>Create a Listing.</Text>
            </View>
            <View style={styles.inputContainer}>
                <View style={styles.switchContainer}>
                    <Text style={styles.label}>Schedule Listing</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        value={isScheduled}
                        onValueChange={setIsScheduled} />
                </View>

                {isScheduled && (
                    <View style={styles.timeContainer}>
                        <Button title="Set Start Time" onPress={() => {
                            console.log('Button Pressed - Showing Active Time Picker');
                            setShowActiveTimePicker(true)}
                        } />
                        {showActiveTimePicker && (
                            <DateTimePicker
                                value={activeTime}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={(event, selectedTime) => {
                                    console.log('DateTimePicker Change - Active Time:', selectedTime);
                                    handleTimeChange(event, selectedTime, 'activeTime')} 
                                } />
                        )}
                    </View>
                )}

                <TouchableOpacity style={styles.picButton} onPress={() => navigation.navigate('PhotoPicker')}>
                    <Text style={styles.buttonText}>
                        Add Picture
                    </Text>
                </TouchableOpacity>
                {imageURL ? <Image source={{ uri: imageURL }} style={styles.previewImage} /> : null}
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
                    placeholder="Where is the food available?"
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
                            onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, 'clearTime')} />
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
        padding: 0,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#001a4d',
        padding: 10,
        borderRadius: 0,
        width: '100%',
    },
    logo: {
        width: 47,
        height: 50,
        marginRight: 10,
    },
    previewImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 10,
        padding: 10
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#f5f5f5',
        fontSize: 18,
    },
    timeContainer: {
        marginBottom: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    picButton: {
        backgroundColor: '#001a4d',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#ff9900',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        flex: 1,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 18
    }
});

export default CreateListings;