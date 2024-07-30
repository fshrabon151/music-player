/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface VideoInterface {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

interface VideoListProps {
  videos: VideoInterface[];
  onVideoSelect: (videoId: string) => void;
  videoId: string | null;
}

const VideoList: React.FC<VideoListProps> = ({
  videos,
  onVideoSelect,
  videoId,
}) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md border">
      <h2 className="text-lg md:text-2xl font-semibold mb-4">Trending Music</h2>
      <ul className="space-y-4">
        {videos.map((video, index) => {
          const listId = (video.id as any).videoId ?? video.id;
          return (
            <li
              key={index}
              onClick={() => onVideoSelect(listId)}
              className={`flex items-center p-2 rounded-lg shadow-sm cursor-pointer transition ${
                videoId && videoId === listId
                  ? "bg-gray-200 hover:bg-white"
                  : "white hover:bg-gray-200"
              }`}
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="size-12 md:size-36 object-cover rounded md:rounded-lg"
              />
              <div className="ml-4">
                <div className="w-full">
                  <h3 className="text-xs text-start md:text-lg text-wrap font-semibold">
                    {video.snippet.title}
                  </h3>
                  <p className="text-gray-600  text-wrap text-start text-xs hidden md:block md:text-sm">
                    {video.snippet.description.slice(0, 200)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default VideoList;
