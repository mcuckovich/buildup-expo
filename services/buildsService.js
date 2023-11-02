import axios from "axios";

export const getBuilds = async () => {
  const results = (
    await axios.get(
      `https://us-central1-buildup-steam.cloudfunctions.net/api/builds`
    )
  ).data;
  return results;
};
