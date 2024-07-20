import React, { useState } from 'react';
import { StyleSheet, View, Button, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FIREBASE_STORAGE } from '../../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import * as ImageManipulator from 'expo-image-manipulator';

const PlaceholderImage = require("../.././assets/images/background.jpg");

export default function PhotoPicker() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;

  const pickImageAsync = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      } else {
        Alert.alert('No Image Selected', 'You did not select any image.');
      }
    } catch (error) {
      console.error("Image Picker Error: ", error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const compressImage = async (uri) => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipulatedImage.uri;
    } catch (error) {
      console.error("Image Compression Error: ", error);
      Alert.alert('Error', 'Failed to compress image. Please try again.');
      return uri;
    }
  };

  const uploadImageAsync = async () => {
    if (!user) {
      Alert.alert('Not Authenticated', 'You must be logged in to upload an image.');
      return;
    }

    if (selectedImage) {
      try {
        setUploading(true);
        const compressedUri = await compressImage(selectedImage);
        const response = await fetch(compressedUri);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();
        const storageRef = ref(FIREBASE_STORAGE, `foodImages/${Date.now()}`);
        const snapshot = await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setUploading(false);
        navigation.navigate('BuffetTabsLayout', {
          screen: 'Create Listings',
          params: { imageUrl: downloadURL }
        });
      } catch (error) {
        setUploading(false);
        console.error("Upload Error: ", error.message);
        Alert.alert('Upload Error', `Failed to upload image. Please try again. ${error.message}`);
      }
    } else {
      Alert.alert('No Image Selected', 'Please select an image to upload.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
          <Image source={PlaceholderImage} style={styles.image} />
        )}
      </View>
      <View style={styles.footerContainer}>
        <Button title="Choose a Photo" onPress={pickImageAsync} />
        {uploading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Upload Photo" onPress={uploadImageAsync} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  image: {
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: "#fff"
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});