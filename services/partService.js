import axios from "axios";

export const addPartRequest = async (request) => {
  const results = (
    await axios.put(
      `https://us-central1-buildup-steam.cloudfunctions.net/api/parts/add/request`,
      request
    )
  ).data;
  return results;
};
