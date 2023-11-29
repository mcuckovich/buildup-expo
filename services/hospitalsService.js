import axios from "axios";

export const getHospitals = async () => {
  const results = (
    await axios.get(
      `https://us-central1-buildup-steam.cloudfunctions.net/api/hospitals`
    )
  ).data;
  return results;
};
