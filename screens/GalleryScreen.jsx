import React, { useContext, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { BuildsContext } from "../BuildsContext";
import { useNavigation, useRoute } from "@react-navigation/native";

// Memoized Image component
const MemoizedImage = React.memo(({ uri }) => (
  <Image source={{ uri }} style={styles.image} resizeMode="contain" />
));

// Constants
const LARGE_SCREEN_THRESHOLD = 768;

const GalleryScreen = () => {
  const { builds, insets, windowWidth } = useContext(BuildsContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { buildId } = route.params;
  const isLargeScreen = windowWidth > LARGE_SCREEN_THRESHOLD;

  const build = useMemo(
    () => builds.find((item) => item._id === buildId),
    [builds, buildId]
  );

  if (!build) {
    // Handle the case where the build is not found
    return <Text>Build not found</Text>;
  }

  const getBorderColor = useMemo(() => {
    const colorMap = {
      Purple: "#911F7B",
      Yellow: "#EFC20E",
      Red: "#E64B3B",
      Orange: "#E9832F",
      Green: "#A4CB3A",
      Blue: "#2365A1",
    };
    return colorMap[build.kitColor] || "#ddd";
  }, [build.kitColor]);

  const handleImagePress = (index) => {
    navigation.navigate("Slideshow", {
      buildId,
      startIndex: index,
    });
  };

  const calculateCardWidth = () => {
    return isLargeScreen
      ? (windowWidth - insets.left - insets.right) / 4 - 12.5
      : (windowWidth - insets.left - insets.right) / 2 - 15;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {build.images.map((item, index) => (
        <TouchableOpacity
          key={`${index}`}
          style={{
            ...styles.card,
            borderColor: getBorderColor,
            width: calculateCardWidth(),
            margin: 5,
          }}
          onPress={() => handleImagePress(index)}
        >
          <View style={styles.imageContainer}>
            <MemoizedImage uri={item} />
          </View>
          <View style={styles.indexContainer}>
            <Text style={styles.indexIndicator}>{index + 1}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 3,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  imageContainer: {
    width: "100%",
    height: 150,
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
