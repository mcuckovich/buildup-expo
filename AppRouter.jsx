import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Import your screen components here
import HomeScreen from "./screens/HomeScreen";
import GalleryScreen from "./screens/GalleryScreen";
import SlideshowScreen from "./screens/SlideshowScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Stack = createStackNavigator();

const AppRouter = () => {
  const navigation = useNavigation();
  const [isClicked, setIsClicked] = useState(false);

  const toggleClicked = () => {
    setIsClicked((prevState) => !prevState);
  };

  const handleSettingsClick = () => {
    setIsClicked(false);
    navigation.navigate("Settings");
  };

  const handleOptionClick = () => {
    setIsClicked(false);
  };

  const HamburgerIcon = () => (
    <TouchableOpacity onPress={toggleClicked}>
      <Text style={{ fontSize: 24, marginRight: 20 }}>
        {isClicked ? "✕" : "☰"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: () => (
          <View style={{ marginRight: 10 }}>
            <HamburgerIcon />
            {isClicked && (
              <View
                style={{
                  position: "absolute",
                  backgroundColor: "white",
                  top: 60,
                  right: 10,
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "black",
                  zIndex: 1,
                }}
              >
                <TouchableOpacity onPress={handleSettingsClick}>
                  <Text style={{ fontSize: 20, marginVertical: 10 }}>
                    Settings
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleOptionClick}>
                  <Text style={{ fontSize: 20, marginVertical: 10 }}>
                    Request Parts
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleOptionClick}>
                  <Text style={{ fontSize: 20, marginVertical: 10 }}>
                    Survey
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ),
      }}
    >
      <Stack.Screen name="Builds" component={HomeScreen} />
      <Stack.Screen name="Gallery" component={GalleryScreen} />
      <Stack.Screen name="Slideshow" component={SlideshowScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default AppRouter;
