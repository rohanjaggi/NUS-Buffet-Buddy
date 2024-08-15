import { FIREBASE_AUTH } from '../../firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView, Image } from 'react-native';
import sign from '../../assets/sign.png';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  // for sign-in
  const signIn = async () => {
    setLoading(true);
    try { 
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      const userId = response.user.uid;
      navigation.navigate('InsideLayout', {
        screen: 'List',
        params: { userId },
      });
    } catch (error: any) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={sign} style={styles.logo} />
      </View>
      <Text style={styles.text}>Login.</Text>
      <KeyboardAvoidingView behavior="padding">
        <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize='none' 
        onChangeText={(text) => setEmail(text)}>
        </TextInput>
        <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder="Password" autoCapitalize='none' 
        onChangeText={(text) => setPassword(text)}>
        </TextInput>

        {loading ? (
          <ActivityIndicator size="large" color='#0000ff' />
        ) : (
          <>
            <Button title="Login" onPress={signIn} />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 100
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    marginVertical: 4,
    height : 50,
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#fff',
    fontFamily: 'Rubik_400Regular',
  },
  text: {
    color: '#00008b', 
    fontSize: 30,  
    fontWeight: 'bold',
  },
  logo: {
    width: 200,
    height: 150,
    marginBottom: 20,
  }
});