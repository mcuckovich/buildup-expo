import React, { useMemo, useContext } from "react";
import { BuildsContext } from "../BuildsContext";
import {
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { builds, isLoaded } = useContext(BuildsContext);

  const buildsMemo = useMemo(() => {
    return builds;
  }, [builds]);

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  const navigateToGallery = (buildId) => {
    navigation.navigate("Gallery", { buildId });
  };

  const RenderBuildItem = React.memo(({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigateToGallery(item._id)}
      >
        <Image style={styles.image} source={{ uri: item.images[0] }} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.kitColor}>{item.kitColor}</Text>
      </TouchableOpacity>
    );
  });

  return (
    <FlatList
      data={buildsMemo}
      renderItem={({ item }) => <RenderBuildItem item={item} />}
      keyExtractor={(item) => item._id}
      numColumns={2}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    margin: 10,
    padding: 10,
  },
  image: {
    flex: 1,
    borderRadius: 8,
    marginBottom: 10,
    aspectRatio: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  kitColor: {
    color: "gray",
  },
});

export default HomeScreen;
