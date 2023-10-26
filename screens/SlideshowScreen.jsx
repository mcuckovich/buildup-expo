import React, { useState, useContext, useMemo, useRef } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  Image,
  Text,
  Animated,
  useWindowDimensions,
} from "react-native";
import { BuildsContext } from "../BuildsContext";

const SlideshowScreen = ({ route }) => {
  const { builds } = useContext(BuildsContext);
  const { buildId, startIndex } = route.params;
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const animation = useRef(new Animated.Value(0)).current;
  const windowWidth = useWindowDimensions().width;
  const SWIPE_THRESHOLD = 50;

  const images = useMemo(() => {
    const build = builds.find((item) => item._id === buildId);
    return build ? build.images : [];
  }, [builds, buildId]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      animation.setValue(gestureState.dx);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > SWIPE_THRESHOLD && currentIndex > 0) {
        handleSwipeLeft();
      } else if (
        gestureState.dx < -SWIPE_THRESHOLD &&
        currentIndex < images.length - 1
      ) {
        handleSwipeRight();
      } else {
        Animated.spring(animation, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const handleSwipeLeft = () => {
    Animated.timing(animation, {
      toValue: windowWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      animation.setValue(0);
    });
  };

  const handleSwipeRight = () => {
    Animated.timing(animation, {
      toValue: -windowWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      animation.setValue(0);
    });
  };

  const animatedStyle = {
    transform: [{ translateX: animation }],
  };

  const currentBuild = builds.find((build) => build._id === buildId);
  const kitColor = currentBuild ? currentBuild.kitColor : "Purple";

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {images.map((image, index) => {
        if (index === currentIndex) {
          return (
            <Animated.View
              key={index}
              style={[styles.imageContainer, animatedStyle]}
            >
              <Image source={{ uri: image }} style={styles.image} />
            </Animated.View>
          );
        }
      })}
      <View
        style={[
          styles.slideNumberContainer,
          { backgroundColor: getBackgroundColor(kitColor) },
        ]}
      >
        <Text style={styles.slideNumberText}>
          {currentIndex + 1} / {images.length}
        </Text>
      </View>
    </View>
  );
};

const getBackgroundColor = (kitColor) => {
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
      return "rgba(0, 0, 0, 0.6)";
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  slideNumberContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  slideNumberText: {
    color: "#fff",
  },
});

export default SlideshowScreen;
