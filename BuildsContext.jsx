import React, { createContext, useState, useEffect } from "react";
import { getBuilds } from "./services/buildsService";
import * as FileSystem from "expo-file-system";

const BuildsContext = createContext();

const BuildsProvider = ({ children }) => {
  const [builds, setBuilds] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const downloadImages = async (buildId) => {
    try {
      const buildsResponse = await getBuilds();
      const targetBuildIndex = buildsResponse.findIndex(
        (build) => build._id === buildId
      );
      if (targetBuildIndex !== -1) {
        const targetBuild = buildsResponse[targetBuildIndex];
        const updatedImages = [];

        // Create a map to store the downloaded images in the same order as the original array.
        const downloadedImagesMap = new Map();

        // Iterate over the images in the target build and download them.
        await Promise.all(
          targetBuild.images.map(async (image, index) => {
            try {
              // Download the image.
              const downloadedImage = await FileSystem.downloadAsync(
                image,
                `${FileSystem.documentDirectory}${targetBuild.title}${index}`
              );

              // Add the downloaded image to the map.
              downloadedImagesMap.set(index, downloadedImage.uri);
            } catch (error) {
              console.error("Error downloading image:", error);
            }
          })
        );

        // Iterate over the downloaded images map and add them to the updated images array.
        for (const [index, uri] of downloadedImagesMap) {
          updatedImages[index] = uri;
        }

        setBuilds((prev) => {
          const prevBuildIndex = prev.findIndex(
            (item) => item._id === targetBuild._id
          );
          return [
            ...prev.slice(0, prevBuildIndex),
            { ...targetBuild, images: updatedImages, downloaded: true },
            ...prev.slice(prevBuildIndex + 1),
          ];
        });
      }
    } catch (error) {
      console.error("Error in downloadImages:", error);
    }
  };

  useEffect(() => {
    if (!isLoaded) {
      const fetchBuildsAsync = async () => {
        try {
          const fetchedBuilds = await getBuilds();
          setBuilds(fetchedBuilds);
          setIsLoaded(true);
        } catch (error) {
          console.error("Error fetching builds:", error);
        }
      };

      fetchBuildsAsync();
    }
  }, [isLoaded]);

  const value = {
    builds,
    isLoaded,
    downloadImages,
  };

  return (
    <BuildsContext.Provider value={value}>{children}</BuildsContext.Provider>
  );
};

export { BuildsProvider, BuildsContext };
