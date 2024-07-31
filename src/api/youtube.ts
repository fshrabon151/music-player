import axios from "axios";

export const API_KEY = "AIzaSyBl0lwt2g3yY_gYE58cNGzSbzGZcNTvpuk";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export const searchVideos = async (query: string | undefined) => {
  const url = `${BASE_URL}/${query ? "search" : "videos"}`;
  const response = await axios.get(url, {
    params: {
      part: "snippet",
      maxResults: 27,
      type: "video",
      videoCategoryId: "10", // Category ID for music
      key: API_KEY,
      ...(query ? { q: query } : { chart: "mostPopular", regionCode: "BD" }), // Specify your region if needed
    },
  });
  return response.data.items;
};

export const getTrendingMusicVideos = async () => {
  const response = await axios.get(`${BASE_URL}/videos`, {
    params: {
      part: "snippet",
      chart: "mostPopular",
      videoCategoryId: "10", // Category ID for music
      regionCode: "US", // Specify your region if needed
      maxResults: 27,
      key: API_KEY,
    },
  });
  return response.data.items;
};

export const getRecommendedVideos = async (videoId: string) => {
  const response = await axios.get(`${BASE_URL}/search`, {
    params: {
      part: "snippet",
      relatedToVideoId: videoId,
      type: "video",
      maxResults: 10,
      key: API_KEY,
      videoCategoryId: "10", // Category ID for music
    },
  });

  return response.data.items;
};
