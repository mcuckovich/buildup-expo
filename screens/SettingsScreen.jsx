import React, { useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Switch,
  StyleSheet,
  Button,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { BuildsContext } from "../BuildsContext";

const SettingsScreen = () => {
  const { builds, toggleVisibility, downloadAndSaveBuilds } =
    useContext(BuildsContext);
  const uniqueKitColors = Array.from(
    new Set(builds.map((item) => item.kitColor))
  );
  const [isDownloading, setIsDownloading] = useState(false);

  const updateHandler = async () => {
    setIsDownloading(true);
    await downloadAndSaveBuilds();
    setIsDownloading(false);
  };

  const renderItem = ({ item }) => {
    const toggleColor = builds.find((build) => build.kitColor === item)
      ?.visibility
      ? "white"
      : "gray";

    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item}</Text>
        <Switch
          style={styles.toggle}
          trackColor={{ false: "black", true: "#34C759" }}
          thumbColor={toggleColor}
          ios_backgroundColor="black"
          onValueChange={() => toggleVisibility(item)}
          value={builds.find((build) => build.kitColor === item)?.visibility}
        />
      </View>
    );
  };

  const handleUpdateBuilds = () => {
    Alert.alert(
      "Attention",
      "You must have a stable internet connection",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Proceed", onPress: () => updateHandler() },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={uniqueKitColors}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />
      <Button title="Update Builds" onPress={handleUpdateBuilds} />
      <Modal animationType="fade" transparent={true} visible={isDownloading}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ marginTop: 10 }}>This may take a few minutes</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 10,
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
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  toggle: {
    marginRight: 5,
  },
});

export default SettingsScreen;
