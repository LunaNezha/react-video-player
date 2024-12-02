/*
* For convert format from .mp4 to .m3u8 
* And optimize your video
* You should run this command
  ffmpeg -i reel-3.mp4 -c:v libx264 -crf 28 -c:a aac -b:a 128k -hls_time 10 -hls_list_size 0 -hls_segment_filename "segment_%03d.ts" reel-3.m3u8
*/

import { cn } from "@utils/classnames";
import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import CustomVideoPoster from "@assets/images/video-poster.jpg";

type Props = {
  videoSrc?: string;
  videoPoster?: string;
  isAutoplay?: boolean;
  isLoop?: boolean;
  isShowDurationTime?: boolean;
  isSmallControlls?: boolean;
  className?: string;
};

let currentlyPlayingVideo: HTMLVideoElement | null = null;

const VideoPlayer = (props: Props) => {
  const {
    videoSrc,
    className,
    videoPoster,
    isAutoplay = false,
    isLoop = true,
    isShowDurationTime = true,
    isSmallControlls = false,
  } = props;
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [poster, setPoster] = useState<string | undefined>(videoPoster);
  const [showPlayPauseIcon, setShowPlayPauseIcon] = useState<boolean>(false);
  const [isShowVolumeController, setIsShowVolumeController] =
    useState<boolean>(false);
  const [playPauseIcon, setPlayPauseIcon] = useState("");
  const [volume, setVolume] = useState<number>(0.3);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleNewVideoPlay = () => {
    if (currentlyPlayingVideo && currentlyPlayingVideo !== videoRef.current) {
      currentlyPlayingVideo.pause();
    }

    currentlyPlayingVideo = videoRef.current;
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setPlayPauseIcon("play");
  };

  const handlePause = () => {
    setIsPlaying(false);
    setPlayPauseIcon("pause");
  };

  const handleMuteHover = () => {
    setIsShowVolumeController(true);
  };

  const handleMuteLeave = () => {
    setIsShowVolumeController(false);
  };

  const handleTogglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setPlayPauseIcon("pause");
        setPoster(undefined);
      } else {
        videoRef.current.play();
        handleNewVideoPlay();
        setPlayPauseIcon("play");
        setPoster(undefined);
      }

      setIsPlaying(!isPlaying);
      setShowPlayPauseIcon(true);
      setTimeout(() => setShowPlayPauseIcon(false), 500);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);

    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
      } else {
        videoRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  const handleToggleFullScreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }

      setIsFullScreen(!isFullScreen);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      window.requestAnimationFrame(handleTimeUpdate);
    }
  };

  const handleDurationChange = () => {
    videoRef.current && setDuration(videoRef.current.duration);
  };

  const handleProgressChange = (event: any) => {
    if (videoRef.current) {
      const newTime = event.target.value;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number = 0) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    setPoster(videoPoster || CustomVideoPoster);
  }, [videoPoster]);

  useEffect(() => {
    const handleContextMenu = (e: any) => {
      e.preventDefault();
    };

    const videoElement = videoRef.current;
    videoElement?.addEventListener("contextmenu", handleContextMenu);

    return () => {
      videoElement?.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  useEffect(() => {
    if (videoSrc) {
      if (videoSrc.endsWith(".m3u8")) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(videoSrc);
          hls.attachMedia(videoRef.current!);

          return () => {
            hls.destroy();
          };
        } else if (
          videoRef.current?.canPlayType("application/vnd.apple.mpegurl")
        ) {
          videoRef.current.src = videoSrc;
          videoRef.current.addEventListener("loadedmetadata", () => {
            videoRef.current?.play();
          });

          return () => {
            videoRef.current?.removeEventListener("loadedmetadata", () => {
              videoRef.current?.play();
            });
          };
        } else {
          console.error("HLS is not supported in this browser.");
        }
      } else {
        fetch(videoSrc)
          .then((response) => response.blob())
          .then((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            videoRef.current!.src = blobUrl;

            return () => URL.revokeObjectURL(blobUrl);
          })
          .catch((error) => {
            console.error("Error fetching video:", error);
          });
      }
    }
  }, [videoSrc]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.addEventListener("play", handlePlay);
      videoElement.addEventListener("pause", handlePause);

      return () => {
        videoElement.removeEventListener("play", handlePlay);
        videoElement.removeEventListener("pause", handlePause);
      };
    }
  }, []);

  return (
    <div
      className={cn(
        className,
        "group/video relative z-10 flex overflow-hidden shadow-2xl transition-all duration-200 ease-in"
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* video */}
      <video
        id="videoPlayer"
        ref={videoRef}
        className="relative h-full w-full object-cover"
        autoPlay={isAutoplay}
        loop={isLoop}
        muted={isMuted}
        preload="none"
        controlsList="nodownload"
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onClick={handleTogglePlayPause}
      >
        <source src={videoSrc} type="application/x-mpegURL" />
      </video>

      {/* play/pause icon overlay */}
      {showPlayPauseIcon && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <i
            className={cn(
              playPauseIcon === "play" ? "fi fi-sr-play" : "fi fi-sr-pause",
              "animate-one-time-pulse rounded-full bg-white-200/10 p-6 text-base text-white-200 sm:text-lg md:text-2xl"
            )}
          />
        </div>
      )}

      {/* poster image */}
      {poster && !isPlaying && (
        <div onClick={handleTogglePlayPause} className="absolute inset-0 z-10 ">
          <img
            src={poster}
            alt="video poster"
            className="h-full w-full object-cover duration-200 ease-in"
          />

          <div className="absolute bottom-auto left-5 right-auto top-5 z-20 m-auto flex">
            <button
              className="text-xl text-white-50/50 drop-shadow-lg transition-all duration-150 ease-in sm:text-4xl md:text-3xl lg:text-4xl xl:text-5xl"
              title="Play/Pause"
              onClick={handleTogglePlayPause}
            >
              <i className="fi fi-rr-play-alt"></i>
            </button>
          </div>
        </div>
      )}

      {/* overlay - controls */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 top-auto z-50 flex w-full flex-nowrap items-end bg-woodsmoke-950/60 backdrop-blur-sm transition-all duration-200 ease-in",
          isSmallControlls
            ? "px-4 py-3"
            : "px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2.5",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <div
          className={cn(
            "flex w-full items-center",
            isSmallControlls ? "gap-2" : "gap-2 sm:gap-3 md:gap-5"
          )}
        >
          <div
            className={cn(
              "flex flex-1 items-center",
              isSmallControlls ? "gap-2" : "gap-2 sm:gap-3 md:gap-4"
            )}
          >
            {/* play/pause */}
            {!isSmallControlls && (
              <button
                className={cn(
                  "rounded-full bg-white-50/20 text-xs text-white-50 transition-all duration-150 ease-in sm:text-sm md:hover:bg-science-blue-900",
                  isSmallControlls ? "p-2.5" : "p-2.5 sm:p-3"
                )}
                onClick={handleTogglePlayPause}
                title="Play/Pause"
              >
                <i
                  className={isPlaying ? "fi fi-sr-pause" : "fi fi-sr-play"}
                ></i>
              </button>
            )}

            {/* duration control */}
            <div className="flex flex-1 items-center gap-1 font-montserrat text-xs font-medium sm:gap-2 sm:text-sm md:text-base">
              {isShowDurationTime && (
                <span
                  slot="start"
                  className="hidden font-montserrat text-xs text-white-50/60 sm:flex"
                >
                  {formatTime(videoRef.current?.currentTime || 0)}
                </span>
              )}

              <input
                type="range"
                id="progress"
                min={0}
                max={duration}
                value={currentTime}
                step={0.01}
                onChange={handleProgressChange}
                className="h-1 flex-1 cursor-pointer appearance-none rounded-lg bg-white-200/20"
              />

              {isShowDurationTime && (
                <span
                  slot="end"
                  className="hidden font-montserrat text-xs text-white-50/60 sm:flex"
                >
                  {formatTime(videoRef.current?.duration || 0)}
                </span>
              )}
            </div>
          </div>

          <div
            className={cn(
              "flex items-center",
              isSmallControlls ? "gap-3" : "gap-3 sm:gap-4 lg:gap-6"
            )}
          >
            {/* volume control */}
            <div
              className="relative flex items-center"
              onMouseEnter={handleMuteHover}
              onMouseLeave={handleMuteLeave}
            >
              {/* mute/unmute */}
              <button
                className="rounded-full text-sm text-white-50 transition-all duration-150 ease-in md:text-base md:hover:text-science-blue-800"
                onClick={handleToggleMute}
                title="Mute/Unmute"
              >
                <i
                  className={cn(
                    isMuted
                      ? "fi fi-sr-volume-mute"
                      : volume === 0
                      ? "fi fi-sr-volume-mute"
                      : volume <= 0.5
                      ? "fi fi-sr-volume-down"
                      : "fi fi-sr-volume"
                  )}
                ></i>
              </button>

              {/* volume controller */}
              <div
                className={cn(
                  "flex h-[4px] items-center duration-300 ease-in-out",
                  isShowVolumeController
                    ? isSmallControlls
                      ? "ml-2 w-12"
                      : "ml-2 w-16"
                    : "w-0"
                )}
              >
                <input
                  type="range"
                  id="volume"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className={cn(
                    "h-[4px] cursor-pointer appearance-none rounded-lg bg-white-200/20 duration-300 ease-in-out",
                    isShowVolumeController
                      ? isSmallControlls
                        ? "w-12"
                        : "w-16"
                      : "hidden-thumb w-0"
                  )}
                />
              </div>
            </div>

            {/* fullscreen */}
            <button
              className="rounded-full text-sm text-white-50 transition-all duration-150 ease-in hover:text-science-blue-800 md:text-base"
              onClick={handleToggleFullScreen}
              title="Fullscreen"
            >
              <i className="fi fi-sr-expand"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
