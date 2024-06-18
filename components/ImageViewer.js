import { StyleSheet, Image } from 'react-native';

export default function ImageViewer({ placeholderImageSource, selectedImage }) {
  // If the selected image is not null, show the image from the device, otherwise, show the placeholder image.
  const imageSource = selectedImage  ? { uri: selectedImage } : placeholderImageSource;
  
  // displays the image
  return (
    <Image source={imageSource} style={styles.image} />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
