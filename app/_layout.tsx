import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ 
          headerTitle: "Home",
          headerShown: false,
          headerStyle: {
            backgroundColor: "#001a4d"
          },
          headerTitleAlign: 'center', // Center the header title
          headerTintColor: '#fff' // Set the title color to white
        }}
      />

      <Stack.Screen
        name="buffetListings"
        options={{
          headerTitle: "Buffet Listings",
          headerStyle: {
            backgroundColor: "#001a4d"
          },
          headerTitleAlign: 'center', // Center the header title
          headerTintColor: '#fff' // Set the title color to white
        }}
      /> 

       <Stack.Screen
        name="PhotoPicker"
        options={{
          headerTitle: "Image Picker",
          headerStyle: {
            backgroundColor: "#001a4d"
          },
          headerTitleAlign: 'center', // Center the header title
          headerTintColor: '#fff' // Set the title color to white
        }}
      />

      <Stack.Screen
        name="/(login)/Login"
        options={{
          headerTitle: "Login Page",
          headerShown: false,
          headerStyle: {
            backgroundColor: "#001a4d"
          },
          headerTitleAlign: 'center', // Center the header title
          headerTintColor: '#fff' // Set the title color to white
        }}
      />
    </Stack>
  );
};

export default RootLayout;

/* Stacks code
      <Stack.Screen
        name="index"
        options={{ 
          headerTitle: "Landing Page",
          headerStyle: {
            backgroundColor: "#001a4d"
          },
          headerTitleAlign: 'center', // Center the header title
          headerTintColor: '#fff' // Set the title color to white
        }}
      />

      <Stack.Screen
        name="buffetListings"
        options={{
          headerTitle: "Buffet Listings",
          headerStyle: {
            backgroundColor: "#001a4d"
          },
          headerTitleAlign: 'center', // Center the header title
          headerTintColor: '#fff' // Set the title color to white
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          headerTitle: "Login Page",
          headerStyle: {
            backgroundColor: "#001a4d"
          },
          headerTitleAlign: 'center', // Center the header title
          headerTintColor: '#fff' // Set the title color to white
        }}
      />
      */