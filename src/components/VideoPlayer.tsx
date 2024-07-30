import React, { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  videoId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const playerInstance = useRef<any>(null); // Ref to store the player instance

  useEffect(() => {
    if (playerRef.current && videoId) {
      // Initialize the YouTube player
      playerInstance.current = new (window as any).YT.Player(
        playerRef.current,
        {
          height: "390",
          width: "640",
          videoId,
          events: {
            onReady: (event: any) => {
              event.target.playVideo();
              setLoading(false); // Set loading to false when the player is ready
            },
            onError: () => {
              setLoading(false); // Set loading to false in case of an error
            },
          },
        }
      );

      // Cleanup function to destroy the player
      return () => {
        if (playerInstance.current) {
          playerInstance.current.destroy();
        }
      };
    }
  }, [videoId]);

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-4">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      )}
      <div ref={playerRef} className="w-full"></div>
    </div>
  );
};

export default VideoPlayer;
