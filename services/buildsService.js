import axios from "axios";

const baseUrl = process.env.EXPO_PUBLIC_API_URL;
export const getBuilds = async () => {
  const results = (await axios.get(`${baseUrl}/builds`)).data;
  return results;
};
