import React from "react";
import { useContext, useMemo } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { BuildsContext } from "../BuildsContext";

const GalleryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { builds } = useContext(BuildsContext);
  const { buildId } = route.params;

  const build = useMemo(() => {
    return builds.find((item) => item._id === buildId);
  }, [builds, buildId]);

  const handleImagePress = (index) => {
    navigation.navigate("Slideshow", {
      buildId: buildId,
      startIndex: index,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.galleryContainer}>
        {build.images.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => handleImagePress(index)}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: image }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
            <View style={styles.indexContainer}>
              <Text style={styles.indexIndicator}>{index + 1}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  galleryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    width: "22%",
    margin: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  image: {
    width: "100%",
    height: 150, // Adjust the height as needed
  },
  indexContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 15,
    padding: 5,
    zIndex: 1,
  },
  indexIndicator: {
    color: "#fff",
  },
});

export default GalleryScreen;
