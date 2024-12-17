declare module "*.svg" {
  import { type FC, type SVGProps } from "react";
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

declare module "*.svg?url" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}

// interface Window {
//   confirmationResult?: firebase.auth.ConfirmationResult;
//   YT?: typeof YT;
// }

declare namespace YT {
  interface PlayerOptions {
    videoId?: string;
    host?: string;
    playerVars?: PlayerVars;
    events?: {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
      onError?: (event: OnErrorEvent) => void;
    };
  }

  interface PlayerVars {
    listType?: "playlist";
    list?: string;
    origin?: string;
    autoplay?: 0 | 1;
    loop?: 0 | 1;
    mute?: 0 | 1;
    start?: number;
    end?: number;
    shuffle?: 0 | 1;
  }

  interface PlayerEvent {
    target: Player;
  }

  interface OnStateChangeEvent extends PlayerEvent {
    data: number;
  }

  interface OnErrorEvent extends PlayerEvent {
    data: number;
  }

  interface VideoData {
    video_id: string;
    title: string;
  }

  interface PlayerInfo {
    playerState: number;
    duration: number;
    currentTime: number;
    volume: number;
    videoData: VideoData;
  }

  interface Player {
    playerInfo: unknown;
    playVideoAt: (...args) => unknown;
    getPlaylist: (...args) => unknown;
    playVideo: (...args) => unknown;
    stopVideo: (...args) => unknown;
    pauseVideo: (...args) => unknown;
    nextVideo: (...args) => unknown;
    previousVideo: (...args) => unknown;
    setVolume: (...args) => unknown;
    seekTo: (...args) => unknown;
    getPlayerInfo: (...args) => PlayerInfo;
    destroy: (...args) => unknown;
  }
}

// declare global {
  interface Window {
    confirmationResult?: firebase.auth.ConfirmationResult;
    YT: YT;
    onYouTubeIframeAPIReady?: () => void;
  }
// }


declare namespace JSX {
  interface IntrinsicElements {
    meshLineGeometry: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      points?: number[]; // Include any specific props `meshLineGeometry` expects
    };

    meshLineMaterial: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      color?: string;
      depthTest?: boolean;
      resolution?: [number, number];
      useMap?: boolean;
      map?: THREE.Texture; // Assuming a Three.js texture is passed
      repeat?: [number, number];
      lineWidth?: number;
    };
  }
}
