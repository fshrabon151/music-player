// src/components/AudioPlayer.tsx
import axios from "axios";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import YouTube, { YouTubeProps } from "react-youtube";
import { API_KEY } from "../api/youtube";

interface AudioPlayerProps {
  videoId: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ videoId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoTitle, setVideoTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const playerRef = useRef<any>(null);

  const fetchVideoDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet`
      );
      const videoDetails = response.data.items[0].snippet;
      setVideoTitle(videoDetails.title);
      setThumbnailUrl(videoDetails.thumbnails.high.url);
      setIsLoading(false);
    } catch (error) {
      setHasError(true);
      setIsLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchVideoDetails();
  }, [fetchVideoDetails]);

  const onPlayerReady: YouTubeProps["onReady"] = useCallback((event: any) => {
    playerRef.current = event.target;
    playerRef.current.unMute(); // Unmute initially
    playerRef.current.playVideo();
    setIsPlaying(true);
    setDuration(event.target.getDuration());
  }, []);

  const onPlayerStateChange: YouTubeProps["onStateChange"] = useCallback(
    (event: any) => {
      setIsPlaying(event.data === 1); // Update isPlaying based on player state
    },
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying]);

  const toggleMuteUnmute = useCallback(() => {
    if (isMuted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setIsMuted((prev) => !prev);
  }, [isMuted]);

  const handleSeek = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const seekTo = parseFloat(event.target.value);
      playerRef.current.seekTo(seekTo, true);
      setCurrentTime(seekTo);
    },
    []
  );

  const handleVolumeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseInt(event.target.value, 10);
      setVolume(newVolume);
      playerRef.current.setVolume(newVolume);
    },
    []
  );

  const formattedCurrentTime = useMemo(() => {
    return `${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60)
      .toString()
      .padStart(2, "0")}`;
  }, [currentTime]);

  const formattedDuration = useMemo(() => {
    return `${Math.floor(duration / 60)}:${Math.floor(duration % 60)
      .toString()
      .padStart(2, "0")}`;
  }, [duration]);

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (hasError) {
    return (
      <div className="error-message">
        Error loading video details. Please try again later.
      </div>
    );
  }

  return (
    <div
      className="youtube-audio-player p-4 text-white rounded-lg shadow-lg mx-auto"
      style={{
        backgroundImage: `url(${thumbnailUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <YouTube
        videoId={videoId}
        opts={{ height: "0", width: "0", playerVars: { autoplay: 1 } }}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
      />
      <div className="overlay bg-black bg-opacity-50 p-2 rounded-lg md:p-4">
        <h1 className="text-base md:text-2xl mb-2 md:mb-4">{videoTitle}</h1>
        <div className="controls flex items-center justify-between mt-2 md:mt-4">
          <button onClick={togglePlayPause} className="text-lg md:text-2xl">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={toggleMuteUnmute} className="text-lg md:text-2xl">
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        </div>
        <div className="seek-bar mt-2 md:mt-4">
          <input
            type="range"
            min="0"
            max={duration}
            step="1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs md:text-sm mt-1">
            <span>{formattedCurrentTime}</span>
            <span>{formattedDuration}</span>
          </div>
        </div>
        <div className="volume-control mt-2 md:mt-4 flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
