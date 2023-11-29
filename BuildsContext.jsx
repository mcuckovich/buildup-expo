import React, { createContext, useState, useEffect } from "react";
import { getHospitals } from "./services/hospitalsService";
import { getBuilds } from "./services/buildsService";
import * as FileSystem from "expo-file-system";

const BuildsContext = createContext();

const BuildsProvider = ({ children }) => {
  const [builds, setBuilds] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAllBuilds, setShowAllBuilds] = useState(false);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    (async () => {
      setHospitals(await getHospitals());
    })();
  }, []);

  // Move the buildsFilePath variable to the top of the component.
  const buildsFilePath = `${FileSystem.documentDirectory}builds.json`;
  const showAllBuildsFilePath = `${FileSystem.documentDirectory}showAllBuilds.json`;

  useEffect(() => {
    if (!isLoaded) {
      checkDownloadedImages();
      checkShowAllBuildsPreference();
    }
  }, [isLoaded]);

  const downloadAndSaveBuilds = async () => {
    // Get the builds from the server.
    const fetchedBuilds = await getBuilds();

    // Create a new variable to store the updated builds.
    const updatedBuilds = [];

    // Map over the fetched builds and download the images.
    await Promise.all(
      fetchedBuilds.map(async (build) => {
        // Download the images for the build.
        const downloadedImages = await Promise.all(
          build.images.map(async (image, index) => {
            const downloadedImage = await FileSystem.downloadAsync(
              image,
              `${FileSystem.documentDirectory}${build.title}${index}`
            );
            return downloadedImage.uri;
          })
        );

        // Update the build's images property with the downloaded images.
        build.images = downloadedImages;

        // Add the updated build to the updatedBuilds array.
        updatedBuilds.push(build);
      })
    );

    // Set the visibility property of each build.
    updatedBuilds.forEach((build) => {
      build.visibility = true;
    });

    // Sort the updated builds array by the order in which they were fetched.
    updatedBuilds.sort((a, b) => {
      return fetchedBuilds.indexOf(a) - fetchedBuilds.indexOf(b);
    });

    // Save the builds to the builds.json file.
    const buildsJson = JSON.stringify(updatedBuilds);
    await FileSystem.writeAsStringAsync(buildsFilePath, buildsJson);
    setBuilds(updatedBuilds);
    setIsLoaded(true);
  };

  const checkDownloadedImages = async () => {
    try {
      // Get the builds from the builds.json file.
      if ((await FileSystem.getInfoAsync(buildsFilePath)).exists) {
        const buildsJson = await FileSystem.readAsStringAsync(buildsFilePath);
        const builds = JSON.parse(buildsJson);

        // Set the builds state.
        setBuilds(builds);
        setIsLoaded(true);
      } else {
        await downloadAndSaveBuilds();
      }
    } catch (error) {
      // If the builds.json file does not exist or cannot be read, download the builds from the server.
      console.error("Error reading builds from filesystem:", error);
    }
  };

  const toggleVisibility = async (kitColor) => {
    const updatedBuilds = builds.map((item) =>
      item.kitColor === kitColor
        ? {
            ...item,
            visibility: !item.visibility,
          }
        : item
    );

    setBuilds(updatedBuilds);

    // Save the updated builds to the builds.json file.
    const buildsJson = JSON.stringify(updatedBuilds);
    try {
      await FileSystem.writeAsStringAsync(buildsFilePath, buildsJson);
    } catch (error) {
      console.error("Error writing updated builds to filesystem:", error);
    }
  };

  const toggleShowAllBuilds = async () => {
    const updatedShowAllBuilds = !showAllBuilds;

    // Save the updated showAllBuilds preference to the file system
    const showAllBuildsJson = JSON.stringify(updatedShowAllBuilds);
    await FileSystem.writeAsStringAsync(
      showAllBuildsFilePath,
      showAllBuildsJson
    );

    setShowAllBuilds(updatedShowAllBuilds);
  };

  const checkShowAllBuildsPreference = async () => {
    try {
      // Check if the showAllBuilds file exists
      if ((await FileSystem.getInfoAsync(showAllBuildsFilePath)).exists) {
        // Read the showAllBuilds preference from the file
        const showAllBuildsJson = await FileSystem.readAsStringAsync(
          showAllBuildsFilePath
        );
        const parsedShowAllBuilds = JSON.parse(showAllBuildsJson);

        // Set the showAllBuilds state
        setShowAllBuilds(parsedShowAllBuilds);
      } else {
        // Create the showAllBuilds file with the default value
        const showAllBuildsJson = JSON.stringify(false);
        await FileSystem.writeAsStringAsync(
          showAllBuildsFilePath,
          showAllBuildsJson
        );
      }
    } catch (error) {
      // If the showAllBuilds file cannot be read or created, use the default value
      console.error("Error reading showAllBuilds preference:", error);
      setShowAllBuilds(false);
    }
  };

  const value = {
    builds,
    isLoaded,
    toggleVisibility,
    downloadAndSaveBuilds,
    toggleShowAllBuilds,
    showAllBuilds,
    hospitals,
  };

  return (
    <BuildsContext.Provider value={value}>{children}</BuildsContext.Provider>
  );
};

export { BuildsProvider, BuildsContext };
