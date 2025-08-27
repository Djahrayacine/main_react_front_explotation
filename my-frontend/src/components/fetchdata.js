// src/utils/fetchData.js
import axios from "axios";

export const fetchData = async (url, setData) => {
  try {
    const response = await axios.get(url);
    setData(response.data);
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
  }
};
