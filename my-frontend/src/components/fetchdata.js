// src/utils/fetchData.js
import axios from "axios";

export const fetchData = async (url, setData) => {
  try {
    const { data } = await axios.get(url);
    setData(data);
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};
