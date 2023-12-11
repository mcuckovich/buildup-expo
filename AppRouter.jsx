import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BuildsContext } from "./BuildsContext";
import PasswordScreen from "./screens/PasswordScreen";
import HomeScreen from "./screens/HomeScreen";
import GalleryScreen from "./screens/GalleryScreen";
import SlideshowScreen from "./screens/SlideshowScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SmallLogo from "./assets/smallLogo.svg";

const Stack = createStackNavigator();

const AppRouter = () => {
  const { builds, access } = useContext(BuildsContext);
  const navigation = useNavigation();

  const handleSettingsClick = () => {
    navigation.navigate("Settings");
  };

  if (!access) {
    // Render only the PasswordScreen if access is not true
    return <PasswordScreen />;
  }

  return (
    <SafeAreaProvider>
      <Stack.Navigator
        screenOptions={({ route }) => ({
          headerTitle: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Builds")}>
              <SmallLogo width={30} height={30} />
            </TouchableOpacity>
          ),
          headerRight: () => {
            if (route.name !== "Settings" && builds.length) {
              return (
                <View style={{ marginRight: 10 }}>
                  <TouchableOpacity onPress={handleSettingsClick}>
                    <Text style={{ fontSize: 24 }}>⚙</Text>
                  </TouchableOpacity>
                </View>
              );
            }
          },
        })}
      >
        <Stack.Screen name="Builds" component={HomeScreen} />
        <Stack.Screen name="Gallery" component={GalleryScreen} />
        <Stack.Screen name="Slideshow" component={SlideshowScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
};

export default AppRouter;
