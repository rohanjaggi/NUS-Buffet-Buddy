import { Text, View } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';

export default function index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl">This is fatty123's profile page.</Text>
      <Text className="text-m">He eats way too much, and so has an EXP level of 4000.</Text>
      <Text className="text-m">fatty123 is singlehandedly fighting all foodwaste in NUS.</Text>      
      <StatusBar style="auto" />
    </View>
  );
}
