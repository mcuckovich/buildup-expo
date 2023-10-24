import React, { useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { BuildsContext } from "../BuildsContext";
import { MaterialIcons } from "@expo/vector-icons";
import Pulse from "react-native-pulse";

const SettingsScreen = () => {
  const { builds, downloadImages } = useContext(BuildsContext);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingItemId, setDownloadingItemId] = useState(null);

  const handleDownloadImages = async (buildId) => {
    setIsDownloading(true);
    setDownloadingItemId(buildId);
    await downloadImages(buildId);
    setIsDownloading(false);
    setDownloadingItemId(null);
  };

  const renderItem = ({ item }) => {
    const isDisabled = isDownloading && downloadingItemId !== item._id;

    return (
      <View style={styles.item}>
        <View style={styles.titleContainer}>
          <Switch value={true} onValueChange={() => {}} style={styles.toggle} />
          <Text style={styles.title}>{item.title}</Text>
        </View>
        {item.downloaded && (
          <MaterialIcons name="check" size={24} color="black" />
        )}
        <TouchableOpacity
          onPress={() => handleDownloadImages(item._id)}
          style={styles.buttonContainer}
          disabled={isDisabled}
        >
          {item.downloaded ? (
            <Text style={styles.downloadButton}>Download Again</Text>
          ) : isDownloading && downloadingItemId === item._id ? (
            <Pulse
              color="blue"
              numPulses={3}
              diameter={40}
              speed={20}
              duration={2000}
            />
          ) : (
            <Text style={styles.downloadButton}>Download Images</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={builds}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  downloadButton: {
    color: "blue",
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggle: {
    marginRight: 5,
  },
});

export default SettingsScreen;
