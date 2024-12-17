/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useState } from "react";

// Enums for player state
export enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}

// Type for player details
export interface PlayerDetails {
  id: string;
  state: PlayerState;
  title: string;
  duration: number;
  currentTime: number;
  volume: number;
  playlistCount: number;
}

// Options for YouTube player
export interface Options {
  origin: string;
  autoplay: boolean;
  host: string;
  loop: boolean;
  mute: boolean;
  start: number;
  end: number;
  shuffle: boolean;
}

// Props for the useYoutube hook
export interface Props {
  id: string;
  type: "playlist" | "video";
  options?: Partial<Options>;
  events?: Partial<{
    onReady: (event: YT.PlayerEvent) => void;
    onStateChange: (event: YT.OnStateChangeEvent) => void;
    onError: (event: YT.OnErrorEvent) => void;
  }>;
}

// Actions to control the YouTube player
export interface Actions {
  playVideo: () => void;
  playVideoAt: (number: number) => void;
  stopVideo: () => void;
  pauseVideo: () => void;
  nextVideo: () => void;
  previousVideo: () => void;
  setVolume: (volume: number) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
}

// The return type of the useYoutube hook
export interface YoutubeHook {
  playerDetails: PlayerDetails;
  actions: Actions;
}

// Global YouTube Player variable
let player: YT.Player;

// Utility to initialize iframe container
const initializeIframe = (id: string) => {
  const iframe = document.createElement("div");
  iframe.id = `youtube-player-${id}`;
  iframe.style.setProperty("display", "none");
  document.body.appendChild(iframe);
};

// Utility to load the YouTube iframe API
const loadApi = (id: string, options: YT.PlayerOptions) => {
  if (document.querySelector("[data-youtube]") && window.YT) {
    player = new window.YT.Player(`youtube-player-${id}`, options);
    return;
  }

  const scriptTag = document.createElement("script");
  scriptTag.src = "https://www.youtube.com/iframe_api";
  scriptTag.dataset.youtube = "true";
  document.head.appendChild(scriptTag);

  window.onYouTubeIframeAPIReady = () => {
    player = new window.YT.Player(`youtube-player-${id}`, options);
  };
};

// The useYoutube hook implementation
export const useYoutube = ({
  id,
  type,
  options,
  events,
}: Props): YoutubeHook => {
  const getPlayerOptions = (
    type: "video" | "playlist",
    options?: Partial<Options>,
  ): YT.PlayerOptions => ({
    videoId: type === "video" ? id : undefined,
    host: options?.host,
    playerVars: {
      listType: type === "playlist" ? "playlist" : undefined,
      list: type === "playlist" ? id : undefined,
      origin: options?.origin,
      autoplay: options?.autoplay ? 1 : 0,
      loop: options?.loop ? 1 : 0,
      mute: options?.mute ? 1 : 0,
      start: options?.start,
      end: options?.end,
      shuffle: type === "playlist" && options?.shuffle ? 1 : 0,
    },
    events: {
      onReady: (event: YT.PlayerEvent) => {
        setState(event.target);
        events?.onReady?.(event);

        // if (options?.shuffle) {
        //     event.target.setShuffle(true);
        // }
        // Set playlist count when ready
        if (type === "playlist") {
          const playlist: string[] = event.target.getPlaylist() as string[];
          if (playlist?.length > 0) {
            const randomIndex = Math.floor(
              Math.random() * (playlist?.length - 1),
            );
            event.target.playVideoAt(randomIndex);
          }
          setPlayerDetails((prevState) => ({
            ...prevState,
            playlistCount: playlist?.length || 0,
          }));
        }
      },
      onStateChange: (event: YT.OnStateChangeEvent) => {
        setState(event.target);
        events?.onStateChange?.(event);
      },
      onError: (event: YT.OnErrorEvent) => {
        events?.onError?.(event);
      },
    },
  });

  const [playerDetails, setPlayerDetails] = useState<PlayerDetails>({
    id: "",
    state: -1, // YT.PlayerState.UNSTARTED
    title: "",
    duration: 0,
    currentTime: 0,
    volume: 0,
    playlistCount: 0, // Add playlist count to the state
  });

  useEffect(() => {
    initializeIframe(id);
    loadApi(id, getPlayerOptions(type, options));

    return () => {
      player?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

  const setState = (playerInstance: YT.Player) => {
    const playerInfo = playerInstance.playerInfo as YT.PlayerInfo;
    setPlayerDetails((prev) => ({
      id: playerInfo.videoData?.video_id ?? "",
      state: playerInfo.playerState,
      title: playerInfo.videoData?.title ?? "",
      duration: playerInfo.duration,
      volume: playerInfo.volume,
      currentTime: playerInfo.currentTime,
      playlistCount: prev.playlistCount, // Preserve existing count
    }));
  };

  const proxy = (functionName: keyof Actions, args: unknown[] = []) => {
    if (typeof player?.[functionName] === "function") {
      player[functionName].call(player, ...(args as []));
    } else {
      console.error("Mystery music player not initialized.");
    }
  };

  return {
    playerDetails,
    actions: {
      playVideo: () => proxy("playVideo"),
      playVideoAt: (number) => proxy("playVideoAt", [number]),
      stopVideo: () => proxy("stopVideo"),
      pauseVideo: () => proxy("pauseVideo"),
      nextVideo: () => proxy("nextVideo"),
      previousVideo: () => proxy("previousVideo"),
      setVolume: (volume: number) => {
        setPlayerDetails((prevState) => ({ ...prevState, volume }));
        proxy("setVolume", [volume]);
      },
      seekTo: (seconds: number, allowSeekAhead: boolean) => {
        setPlayerDetails((prevState) => ({
          ...prevState,
          currentTime: seconds,
        }));
        proxy("seekTo", [seconds, allowSeekAhead]);
      },
    },
  };
};
