// src/components/AudioPlayer.tsx
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
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
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet`
      );
      const videoDetails = response.data.items[0].snippet;
      setVideoTitle(videoDetails.title);
      setThumbnailUrl(videoDetails.thumbnails.high.url);
    };

    fetchVideoDetails();
  }, [videoId]);

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
    playerRef.current.unMute(); // Unmute initially
    playerRef.current.playVideo();
    setIsPlaying(true);
    setDuration(event.target.getDuration());
  };

  const onPlayerStateChange: YouTubeProps["onStateChange"] = (event) => {
    if (event.data === 1) {
      // Playing
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlayPause = () => {
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMuteUnmute = () => {
    if (isMuted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseFloat(event.target.value);
    playerRef.current.seekTo(seekTo, true);
    setCurrentTime(seekTo);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value, 10);
    setVolume(newVolume);
    playerRef.current.setVolume(newVolume);
  };

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
      <div className="overlay bg-black bg-opacity-50 p-4 rounded-lg">
        <h1 className="text-2xl mb-4">{videoTitle}</h1>
        <div className="controls flex items-center justify-between mt-4">
          <button onClick={togglePlayPause} className="text-2xl">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={toggleMuteUnmute} className="text-2xl">
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        </div>
        <div className="seek-bar mt-4">
          <input
            type="range"
            min="0"
            max={duration}
            step="1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-sm mt-1">
            <span>
              {Math.floor(currentTime / 60)}:
              {Math.floor(currentTime % 60)
                .toString()
                .padStart(2, "0")}
            </span>
            <span>
              {Math.floor(duration / 60)}:
              {Math.floor(duration % 60)
                .toString()
                .padStart(2, "0")}
            </span>
          </div>
        </div>
        <div className="volume-control mt-4 flex items-center">
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
