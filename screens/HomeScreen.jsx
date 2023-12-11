import React, { useMemo, useContext } from "react";
import {
  Text,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import BigLogo from "../assets/bigLogo.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { BuildsContext } from "../BuildsContext";

const HomeScreen = () => {
  const { builds, isLoaded, showAllBuilds, insets, windowWidth } =
    useContext(BuildsContext);
  const navigation = useNavigation();

  const buildsMemo = useMemo(() => {
    return builds.filter((item) => {
      if (item.visibility) {
        if (showAllBuilds) {
          return item;
        } else {
          if (item.default) {
            return item;
          }
        }
      }
    });
  }, [builds, showAllBuilds]);

  // Check if the builds have finished downloading
  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <BigLogo width={150} height={150} />
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 10 }}>Downloading builds.</Text>
          <Text style={{ marginTop: 10 }}>This may take a few minutes.</Text>
        </View>
      </View>
    );
  }

  // Display the builds if they have finished downloading
  const navigateToGallery = (buildId) => {
    navigation.navigate("Gallery", { buildId });
  };

  const calculateCardWidth = () => {
    return (windowWidth - insets.left - insets.right) / 2 - 15;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.list}>
          {buildsMemo.map((item) => {
            let backgroundColor = "#fff";

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
                key={item._id}
                style={[
                  styles.card,
                  { width: calculateCardWidth(), margin: 5 },
                ]}
                onPress={() => navigateToGallery(item._id)}
              >
                <Image
                  style={styles.image}
                  source={{ uri: item.images[0] }}
                  resizeMode="contain"
                />
                <View style={[styles.textContainer, { backgroundColor }]}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.kitColor}>{item.kitColor}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContent: {
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 10,
    alignItems: "center",
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
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
