import React, { useMemo, useContext } from "react";
import { BuildsContext } from "../BuildsContext";
import {
  Text,
  Image,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { Asset } from "expo-asset";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { builds, isLoaded } = useContext(BuildsContext);
  const windowWidth = useWindowDimensions().width;
  const image = Asset.fromModule(require("../assets/blue-text-logo.png"));

  const buildsMemo = useMemo(() => {
    return builds.filter((item) => item.visibility);
  }, [builds]);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Image source={image} style={styles.logo} />
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 10 }}>Downloading builds.</Text>
          <Text style={{ marginTop: 10 }}>This may take a few minutes.</Text>
        </View>
      </View>
    );
  }

  const navigateToGallery = (buildId) => {
    navigation.navigate("Gallery", { buildId });
  };

  const renderBuildItem = ({ item }) => {
    let backgroundColor = "#fff"; // default background color

    switch (item.kitColor) {
      case "Purple":
        backgroundColor = "#911F7B";
        break;
      case "Yellow":
        backgroundColor = "#EFC20E";
        break;
      case "Red":
        backgroundColor = "#E64B3B";
        break;
      case "Orange":
        backgroundColor = "#E9832F";
        break;
      case "Green":
        backgroundColor = "#A4CB3A";
        break;
      case "Blue":
        backgroundColor = "#2365A1";
        break;
      default:
        backgroundColor = "#fff";
    }

    return (
      <TouchableOpacity
        style={[styles.card, { width: windowWidth / 2 - 15 }]}
        onPress={() => navigateToGallery(item._id)}
      >
        <Image
          style={styles.image}
          source={{ uri: item.images[0] }}
          resizeMode="cover"
        />
        <View
          style={[styles.textContainer, { backgroundColor: backgroundColor }]}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.kitColor}>{item.kitColor}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={buildsMemo}
      renderItem={renderBuildItem}
      keyExtractor={(item) => item._id}
      numColumns={2}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 5,
    paddingTop: 5,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContent: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 10,
    alignItems: "center", // center the content horizontally
  },
  logo: {
    width: 350, // adjust the width as needed
    height: 350, // set a fixed height for the logo
    resizeMode: "contain", // adjust the image size to fit within the set dimensions
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    margin: 5,
    backgroundColor: "white",
  },
  image: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    aspectRatio: 1,
  },
  textContainer: {
    padding: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
    color: "#fff",
  },
  kitColor: {
    color: "#fff",
  },
});

export default HomeScreen;
