import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, Text, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Asset } from "expo-asset";
import { BuildsContext } from "./BuildsContext";

// Import your screen components here
import HomeScreen from "./screens/HomeScreen";
import GalleryScreen from "./screens/GalleryScreen";
import SlideshowScreen from "./screens/SlideshowScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Stack = createStackNavigator();

const AppRouter = () => {
  const { builds } = useContext(BuildsContext);
  const navigation = useNavigation();
  const icon = Asset.fromModule(require("./assets/icon.png"));

  const handleSettingsClick = () => {
    navigation.navigate("Settings");
  };

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        headerTitle: () => (
          <TouchableOpacity onPress={() => navigation.navigate("Builds")}>
            <Image source={icon} style={{ width: 50, height: 50 }} />
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
  );
};

export default AppRouter;
