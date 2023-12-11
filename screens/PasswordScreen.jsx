import React, { useState, useContext } from "react";
import { BuildsContext } from "../BuildsContext";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { checkAccess } from "../services/secretService";
import BigLogo from "../assets/bigLogo.svg";
import Checkbox from "expo-checkbox";

const PasswordScreen = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [failedAttempt, setFailedAttempt] = useState(false);
  const [acknowledgeDownload, setAcknowledgeDownload] = useState(false);
  const { grantAccess } = useContext(BuildsContext);

  const handleLogin = async () => {
    if (acknowledgeDownload) {
      const result = await checkAccess(password);
      if (result.access === true) {
        await grantAccess();
        navigation.navigate("Builds");
      } else {
        setFailedAttempt(true);
      }
    } else {
      alert("Please acknowledge the download size before proceeding.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.innerContainer}>
        <BigLogo style={styles.image} />
        <TextInput
          secureTextEntry
          style={[styles.input, failedAttempt && styles.inputError]}
          placeholder="Enter Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
        />
        {failedAttempt && (
          <Text style={styles.errorText}>
            Incorrect password. Please try again.
          </Text>
        )}
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={acknowledgeDownload}
            onValueChange={setAcknowledgeDownload}
          />
          <Text style={styles.checkboxText}>
            By signing in, you acknowledge downloading 465.5MB of content,
            equivalent to 36 incredibly creative builds worth of instructions.
            This size may fluctuate as we update the content and add even more
            value. Please be aware that the download will take a few minutes,
            depending on your network speed.
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "80%",
    textAlign: "center",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 40,
  },
  checkboxText: {
    marginLeft: 8,
  },
  button: {
    backgroundColor: "#34C759",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PasswordScreen;
