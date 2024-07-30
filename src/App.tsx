import React, { useEffect, useState } from "react";
import { searchVideos } from "./api/youtube";
import "./App.css";
import AudioPlayer from "./components/AudioPlayer";
import SearchBar from "./components/SearchBar";
import VideoList from "./components/VideoList";

const App: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query?: string | undefined) => {
    setLoading(true);
    setError(null);
    setSelectedVideoId(null);
    setVideos([]);
    try {
      const results = await searchVideos(query);
      setVideos(results);
    } catch (err) {
      setError("Failed to fetch videos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideoId(videoId);
    window.scrollTo({
      top: 0,
      behavior: "smooth", // This makes the scrolling smooth
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-4xl text-center mb-8 font-bold text-gray-800">
        Tube<span className="text-red-500">Music</span>
      </h1>
      <div className="container mx-auto px-4">
        <SearchBar onSearch={handleSearch} />

        {loading ? (
          <div className="flex justify-center items-center mb-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="text-center mb-4 text-red-500 text-lg">
                {JSON.stringify(error)}
              </div>
            )}

            {/* {selectedVideoId && <VideoPlayer videoId={selectedVideoId} />} */}
            {selectedVideoId && <AudioPlayer videoId={selectedVideoId} />}
            {!error && (
              <VideoList
                videos={videos}
                onVideoSelect={handleVideoSelect}
                videoId={selectedVideoId}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
