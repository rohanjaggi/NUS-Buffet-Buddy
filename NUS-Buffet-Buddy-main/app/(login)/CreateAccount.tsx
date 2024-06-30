import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import sign from '../../assets/sign.png';

const CreateAccount = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Student', value: 'Student' },
        { label: 'Organiser', value: 'Organiser' }
    ]);
    const auth = FIREBASE_AUTH;
    const db = FIREBASE_DB;

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(response.user, { displayName: name });
            
            await setDoc(doc(db, 'users', response.user.uid), {
                name,
                email,
                role,
            });

            console.log(response);
            alert('Account Created!');
            const userId = response.user.uid;
            navigation.navigate('InsideLayout', {
                screen: 'List',
                params: { userId },
              });
        } catch (error) {
            console.log(error);
            alert('Sign up failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={sign} style={styles.logo} />
            </View>
            <Text style={styles.text}>Create an Account.</Text>
            <KeyboardAvoidingView behavior="padding">
                <TextInput
                    value={name}
                    style={styles.input}
                    placeholder="Name"
                    autoCapitalize="none"
                    onChangeText={(text) => setName(text)}
                />
                <TextInput
                    value={email}
                    style={styles.input}
                    placeholder="Email"
                    autoCapitalize="none"
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    secureTextEntry
                    value={password}
                    style={styles.input}
                    placeholder="Password"
                    autoCapitalize="none"
                    onChangeText={(text) => setPassword(text)}
                />
                <DropDownPicker
                    open={open}
                    value={role}
                    items={items}
                    setOpen={setOpen}
                    setValue={setRole}
                    setItems={setItems}
                    placeholder="Select Role"
                    style={styles.input}
                    containerStyle={{ height: 50 }}
                />
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Button title="Create Account" onPress={signUp} />
                )}
            </KeyboardAvoidingView>
        </View>
    );
};

export default CreateAccount;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 70
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        backgroundColor: '#fff',
        fontFamily: 'Rubik_400Regular',
    },
    text: {
        color: '#00008b',
        fontSize: 30,
        fontWeight: 'bold'
    },
    logo: {
        width: 200,
        height: 150,
        marginBottom: 20,
      }
});
