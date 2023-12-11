import axios from "axios";

export const checkAccess = async (guess) => {
  const results = (
    await axios.post(
      `https://us-central1-buildup-steam.cloudfunctions.net/api/secret`,
      { guess }
    )
  ).data;
  return results;
};
