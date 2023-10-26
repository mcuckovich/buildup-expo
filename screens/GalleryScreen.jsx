import React, { useContext, useMemo } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  useWindowDimensions,
} from "react-native";
import { BuildsContext } from "../BuildsContext";

const GalleryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { builds } = useContext(BuildsContext);
  const { buildId } = route.params;
  const windowWidth = useWindowDimensions().width;

  const build = useMemo(() => {
    return builds.find((item) => item._id === buildId);
  }, [builds, buildId]);

  const handleImagePress = (index) => {
    navigation.navigate("Slideshow", {
      buildId: buildId,
      startIndex: index,
    });
  };

  const getBorderColor = (kitColor) => {
    switch (kitColor) {
      case "Purple":
        return "#911F7B";
      case "Yellow":
        return "#EFC20E";
      case "Red":
        return "#E64B3B";
      case "Orange":
        return "#E9832F";
      case "Green":
        return "#A4CB3A";
      case "Blue":
        return "#2365A1";
      default:
        return "#ddd";
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.galleryContainer}>
        {build.images.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.card,
              {
                width: windowWidth / 4 - 12.5,
                borderColor: getBorderColor(build.kitColor),
              },
            ]}
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
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    paddingTop: 5,
  },
  galleryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  card: {
    margin: 5,
    borderWidth: 3,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  imageContainer: {
    width: "100%",
    height: 150, // Adjust the height as needed
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
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
