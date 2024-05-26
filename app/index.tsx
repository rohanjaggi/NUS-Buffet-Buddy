import { Text, View } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';

export default function index() {
  return (
    <View className="flex-1 items-center justify-center bg-blue-950">
      <Text className="text-2xl font-psemibold text-white">Welcome to NUS Buffet Buddy!</Text>
      <StatusBar style="auto" />
      <Link href="/buffetListings" className="text-xl text-blue-400" >Go to Buffet Listings</Link>
    </View>
  );
}
